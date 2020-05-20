import * as THREE from "three";
import { Premade } from "./Premade";
import { NodeRenderer } from "../nodes/NodeRenderer";
import { PIXINode } from "../nodes/PIXINode";
import { ShaderNode } from "../nodes/ShaderNode";
import { Shaders } from "../shaders";
import { Node } from "../nodes/Node";
import { UniformNode } from "../nodes/UniformNode";

export interface TextScreenOptions {
    width: number;
    height: number;
    backgroundColor?: number;
    marginTop?: number;
    marginLeft?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    defaultTextStyle?: PIXI.TextStyle;
    spaceBetweenLines?: number;
}

export interface TextScreenUpdateOptions {}

export type EventSubscriber = (eventType: string, eventData: any) => void;

export enum EventTypes {
    newTextAnimation = "newTextAnimation",
    newCharacter = "newCharacter",
    textAnimationOver = "textAnimationOver",
}

export class TextScreen implements Premade {
    protected _renderer: NodeRenderer;

    texture?: THREE.Texture;
    quad?: THREE.Mesh;

    protected _outputNode?: Node;

    protected _width: number;
    protected _height: number;
    protected _backgroundColor: number;
    protected _marginTop: number;
    protected _marginLeft: number;
    protected _paddingBottom: number;
    protected _paddingLeft: number;
    protected _defaultTextStyle: any;
    protected _spaceBetweenLines: number;

    protected _background?: PIXI.Graphics;
    protected _text?: PIXI.Container;
    protected _textEntries: PIXI.Text[] = [];

    protected _subscribers: EventSubscriber[] = [];

    constructor(options: TextScreenOptions) {
        this._width = options.width;
        this._height = options.height;

        this._backgroundColor = options.backgroundColor || 0x002c2c;
        this._marginTop = options.marginTop || 90;
        this._marginLeft = options.marginLeft || 240;
        this._paddingBottom = options.paddingBottom || 50;
        this._paddingLeft = options.paddingLeft || 50;
        this._spaceBetweenLines = options.spaceBetweenLines || 20;
        this._defaultTextStyle = options.defaultTextStyle || {
            fontFamily: "Courier New",
            fontSize: 22,
            fontWeight: "bold",
            wordWrap: true,
            wordWrapWidth: this._width - 2 * this._marginLeft - 2 * this._paddingLeft,
            fill: 0x3cdc7c,
        };

        this._renderer = new NodeRenderer({
            noViewport: true,
            width: this._width,
            height: this._height,
        });
    }

    _generateBackground() {
        this._background = new PIXI.Graphics();

        let backgroundWidth = this._width - 2 * this._marginLeft;
        let backgroundHeight = this._height - 2 * this._marginTop;

        this._background.beginFill(this._backgroundColor);
        this._background.drawRect(0, 0, backgroundWidth, backgroundHeight);
        this._background.endFill();

        this._background.pivot.set(backgroundWidth / 2, backgroundHeight / 2);
        this._background.position.set(this._width / 2, this._height / 2);
    }

    _generateText() {
        this._text = new PIXI.Container();
        this._text.position.x = this._marginLeft + this._paddingLeft;
        this._text.position.y = this._marginTop + this._paddingBottom;

        let g = new PIXI.Graphics();
        g.beginFill(0xff0000);
        g.drawRect(
            0,
            0,
            this._width - 2 * this._marginLeft - 2 * this._paddingLeft,
            this._height - 2 * this._marginTop - 2 * this._paddingBottom
        );
        g.endFill();
        g.alpha = 0;
        this._text.addChild(g);
    }

    _addTextLine(textContent: string, textStyle?: any) {
        if (!this._text) return;

        this._text.position.x = this._marginLeft + this._paddingLeft;
        this._text.position.y = this._marginTop + this._paddingBottom;

        let text = new PIXI.Text(textContent, { ...this._defaultTextStyle, ...textStyle });
        text.position.y = this._text.height - text.height;

        for (let i = this._textEntries.length - 1; i >= 0; i--) {
            let entry = this._textEntries[i];

            entry.position.y -= text.height + this._spaceBetweenLines;

            if (entry.position.y < 0) {
                this._textEntries.splice(i, 1);
                this._text && this._text.removeChild(entry);
            }
        }

        this._textEntries.push(text);

        this._text.addChild(text);

        return text;
    }

    _addTextAnimation(
        textContent: string,
        textStyle?: any,
        framesPerChar?: number,
        callback?: () => any
    ) {
        let text = this._addTextLine(textContent, textStyle);
        let block = "█";
        if (text) text.text = block;
        let startTime = performance.now();

        let trigger = this.trigger;
        trigger(EventTypes.newTextAnimation, {});

        return function updateTextAnimation(forceEnd?: boolean) {
            if (text) {
                if (forceEnd) {
                    text.text = textContent;
                    callback && callback();
                    trigger(EventTypes.textAnimationOver, {});
                    return true;
                } else {
                    framesPerChar = framesPerChar || 20;
                    let elapsed = performance.now() - startTime;
                    let charAmount = Math.floor(elapsed / framesPerChar);

                    if (charAmount >= textContent.length) {
                        text.text = textContent;
                        callback && callback();
                        trigger(EventTypes.textAnimationOver, {});
                        return true;
                    } else {
                        if (text.text !== textContent.slice(0, charAmount) + block) {
                            text.text = textContent.slice(0, charAmount) + block;

                            trigger(EventTypes.newTextAnimation, {});
                        }
                        return false;
                    }
                }
            }

            return true;
        };
    }

    /**
     * Builds the screen
     */
    prepare() {
        return new Promise<any>((resolve, reject) => {
            let pixi = new PIXINode("pixi", this._renderer);

            this._generateBackground();
            this._background && pixi.add(this._background);

            this._generateText();
            this._text && pixi.add(this._text);

            let crt = new ShaderNode("crt", this._renderer, {
                fragmentShader: Shaders.compile(
                    Shaders.math,
                    Shaders.filters,

                    /* glsl */ `
                        varying vec2 vUv;
                        uniform sampler2D inputTex;
                        uniform float iTime;
                        uniform vec2 texSize;

                        float gradient(vec2 p) {
                            return 1. - length(p / 3.);
                        }

                        float scanline(vec2 p) {
                            float s = 1. - abs(sin(iTime * 2. + p.y * 3.));
                            return s > 0.7 ? s : 0.;
                        }

                        float smallline(vec2 p) {
                            return abs(sin(iTime * 5. - p.y * 450.) * 0.9);
                        }

                        void main() {
                            vec2 p = curve(vUv);

                            vec4 t = bloom(inputTex, texSize, p, .6, 0.3, 1.);  
                            gl_FragColor = vec4(1.);
                            gl_FragColor = mix(t, (t  + scanline(p) * 0.02 - smallline(p) * 0.02) * gradient((p - 0.5) * 2.), t.a);
                        }
                    `
                ),
            })
                .addInput(pixi, "inputTex")
                .addInput(
                    new UniformNode("texSize", {
                        value: new THREE.Vector2(this._width, this._height),
                    })
                );

            this._outputNode = crt;

            this.update(0);

            this.texture = this._outputNode.output.getValue();
            this.quad = (this._outputNode as ShaderNode).quad;

            this._renderer.connectToScreen(this._outputNode);

            resolve(this.texture);
        });
    }

    /**
     * Updates the screen
     *
     * @param time - Current animation time
     * @param updateOptions - Update options to override defaults
     */
    update(time: number, updateOptions?: TextScreenUpdateOptions) {
        this._render(time);
    }

    _render(time: number) {
        if (!this._outputNode) return;
        this._renderer.update(time);
        this._renderer.render();

        this.texture = this._outputNode.output.getValue();
        this.quad = (this._outputNode as ShaderNode)?.quad;
    }

    /**
     * Retrieves the output texture for external use
     */
    getTexture() {
        return this.texture;
    }

    subscribe(subscriber: EventSubscriber) {
        this._subscribers.push(subscriber);
    }

    trigger(eventType: string, eventData: any) {
        this._subscribers.forEach((subscriber) => subscriber(eventType, eventData));
    }
}
