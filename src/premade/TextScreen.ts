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
    spaceBetweenEntries?: number;
}

export interface TextScreenUpdateOptions {}

export type EventSubscriber = (eventType: string, eventData: any) => void;

export enum EventTypes {
    newTextAnimation = "newTextAnimation",
    newCharacter = "newCharacter",
    textAnimationOver = "textAnimationOver",
}

export type TextAnimation = (deltaTime: number, forceEnd?: boolean) => boolean;

export interface Question {
    selected: string;
    container: PIXI.Container;
    answers: { id: string; container: PIXI.Container; selector: PIXI.Graphics }[];
}

export class TextScreen implements Premade {
    protected _renderer: NodeRenderer;

    texture?: THREE.Texture;
    quad?: THREE.Mesh;

    protected _elapsedTime: number = 0;

    protected _outputNode?: Node;

    protected _width: number;
    protected _height: number;
    protected _backgroundColor: number;
    protected _marginTop: number;
    protected _marginLeft: number;
    protected _paddingBottom: number;
    protected _paddingLeft: number;
    protected _defaultTextStyle: any;
    protected _spaceBetweenEntries: number;

    protected _currentAnimation?: TextAnimation;
    protected _currentQuestion?: Question;

    protected _background?: PIXI.Graphics;
    protected _foreground?: PIXI.Container;

    protected _entries: (PIXI.Container | PIXI.Text | PIXI.Graphics)[] = [];
    //protected _currentAnimation?: () => boolean;
    //protected _currentQuestion?: any;

    protected _subscribers: EventSubscriber[] = [];

    constructor(options: TextScreenOptions) {
        this._width = options.width;
        this._height = options.height;

        this._backgroundColor = options.backgroundColor || 0x002c2c;
        this._marginTop = options.marginTop || 90;
        this._marginLeft = options.marginLeft || 240;
        this._paddingBottom = options.paddingBottom || 50;
        this._paddingLeft = options.paddingLeft || 50;
        this._spaceBetweenEntries = options.spaceBetweenEntries || 20;
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

    _generateForeground() {
        this._foreground = new PIXI.Container();
        this._foreground.position.x = this._marginLeft + this._paddingLeft;
        this._foreground.position.y = this._marginTop + this._paddingBottom;

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
        this._foreground.addChild(g);
    }

    _addEntry(newEntry: PIXI.Container | PIXI.Text | PIXI.Graphics, height?: number) {
        if (!this._foreground) return;

        height = height || newEntry.height;

        newEntry.position.y = this._foreground.height - height;

        for (let i = this._entries.length - 1; i >= 0; i--) {
            let entry = this._entries[i];

            entry.position.y -= height + this._spaceBetweenEntries;

            if (entry.position.y < 0) {
                this._entries.splice(i, 1);
                this._foreground && this._foreground.removeChild(entry);
            }
        }

        this._entries.push(newEntry);
        this._foreground.addChild(newEntry);

        return newEntry;
    }

    _addText(
        textContent: string,
        textStyle?: any,
        options?: { framesPerChar: number },
        callback?: () => any
    ) {
        let block = "█";

        let text = new PIXI.Text(textContent, { ...this._defaultTextStyle, ...textStyle });
        let height = text.height;

        text.text = block;

        this._addEntry(text, height);

        let elapsedTime = 0;
        let framesPerChar = options?.framesPerChar || 60;

        this._trigger(EventTypes.newTextAnimation, {});

        let animation: TextAnimation = (timeDelta: number, forceEnd?: boolean) => {
            if (forceEnd) {
                text.text = textContent;
                setImmediate(() => callback && callback());
                return true;
            }

            elapsedTime += timeDelta;
            let elapsedChars = Math.floor(elapsedTime / framesPerChar);

            if (elapsedChars < textContent.length) {
                if (text.text !== textContent.slice(0, elapsedChars) + block) {
                    text.text = textContent.slice(0, elapsedChars) + block;
                    this._trigger(EventTypes.newCharacter, {});
                }
                return false;
            } else {
                text.text = textContent;
                setImmediate(() => callback && callback());
                this._trigger(EventTypes.textAnimationOver, {});
                return true;
            }
        };

        this._currentAnimation = animation;

        return animation;
    }

    _addQuestion(
        questionText: string,
        answers: { id: string; textContent: string; textStyle?: any }[],
        options?: any
    ) {
        this._addText(
            questionText,
            { ...this._defaultTextStyle, ...options?.questionStyle },
            undefined,
            () => {
                let selected = answers[0].id;

                let question: Question = {
                    selected,
                    container: new PIXI.Container(),
                    answers: [],
                };

                for (let i = 0; i < answers.length; i++) {
                    let answerContainer = new PIXI.Container();

                    let spaceBetweenAnswers =
                        options?.spaceBetweenAnswers || this._spaceBetweenEntries;

                    let answerText = new PIXI.Text(answers[i].textContent, {
                        ...this._defaultTextStyle,
                        ...answers[i].textStyle,
                    });
                    answerText.position.set(40, 10);
                    answerContainer.addChild(answerText);

                    let answerSelector = new PIXI.Graphics();
                    answerSelector.beginFill(
                        answers[i].textStyle?.fill ||
                            options?.questionStyle?.fill ||
                            this._defaultTextStyle.fill
                    );
                    answerSelector.drawRect(0, 0, 10, 10);
                    answerSelector.endFill();
                    answerSelector.position.set(10, 5 + answerText.height / 2);
                    answerSelector.visible = i == 0;
                    answerContainer.addChild(answerSelector);

                    question.answers.push({
                        id: answers[i].id,
                        container: answerContainer,
                        selector: answerSelector,
                    });

                    if (i > 0) {
                        answerContainer.position.y =
                            spaceBetweenAnswers +
                            question.answers[i - 1].container.position.y +
                            question.answers[i - 1].container.height;

                        console.log(answerContainer.position.y);
                    }

                    question.container.addChild(answerContainer);
                }

                this._currentQuestion = question;

                this._addEntry(question.container);
            }
        );
    }

    _selectAnswer(answerId: string) {
        if (this._currentQuestion) {
            this._currentQuestion.answers.forEach(
                (answer) => (answer.selector.visible = answerId === answer.id)
            );
        }
    }

    /**
     * Builds the screen
     */
    prepare() {
        return new Promise<any>((resolve, reject) => {
            let pixi = new PIXINode("pixi", this._renderer);

            this._generateBackground();
            this._background && pixi.add(this._background);

            this._generateForeground();
            this._foreground && pixi.add(this._foreground);

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
    update(deltaTime: number, updateOptions?: TextScreenUpdateOptions) {
        if (!this._currentAnimation || this._currentAnimation(deltaTime)) {
            this._currentAnimation = undefined;
        }

        this._elapsedTime += deltaTime;
        this._render(this._elapsedTime / 1000);
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

    _trigger(eventType: string, eventData: any) {
        this._subscribers.forEach((subscriber) => subscriber(eventType, eventData));
    }
}
