import * as PIXI from "pixi.js";
import * as THREE from "three";
import { Node, NodeOptions } from "./Node";

/**
 * pixi node initialization options
 *
 * @category Nodes
 */
export interface PIXINodeOptions extends NodeOptions {
    /**
     * Whether to render this node only when needsUpdate is true
     */
    manualRender?: boolean;

    /**
     * Force width of the renderer
     */
    width?: number;

    /**
     * Force height of the renderer
     */
    height?: number;

    /**
     * Element where the renderer will drop his canvas
     */
    viewportElement?: HTMLElement;
}

/**
 * pixi.js node
 *
 * @category Nodes
 */
export class PIXINode extends Node {
    /**
     * Internal PIXI application
     */
    private _app: PIXI.Application;

    /**
     * Texture that is used for output
     */
    private _texture: THREE.CanvasTexture;

    /**
     * Whether to render this node only when needsUpdate is true
     */
    private _manualRender?: boolean;

    /**
     * Whether to rerender this node on the next pass (for manual render)
     */
    needsUpdate: boolean = true;

    /**
     * Whether the size for the internal renderer is fixed (passed to the constructor)
     */
    private _fixedSize: boolean = false;

    constructor(id: string, options?: PIXINodeOptions) {
        super(id, options);

        PIXI.utils.skipHello();

        this._manualRender = options?.manualRender;

        this._fixedSize = !!(options?.width || options?.height);

        this.width = options?.width || 0;
        this.height = options?.height || 0;

        this._app = new PIXI.Application({
            width: this.width,
            height: this.height,
            resizeTo: options?.viewportElement
                ? undefined
                : options?.viewportElement,
            autoStart: false,
            transparent: true,
            antialias: true,
        });

        this._texture = new THREE.CanvasTexture(this._app.view);
        this._texture.minFilter = THREE.LinearFilter;
        this._texture.magFilter = THREE.LinearFilter;
    }

    /**
     * Adds a PIXI object to the main container
     *
     * @param obj
     */
    add(obj: PIXI.DisplayObject) {
        this._app.stage.addChild(obj);
    }

    /**
     * Renders the node to an output connection
     */
    render() {
        if (!this._manualRender || this.needsUpdate) {
            this._app.render();
            this._texture.needsUpdate = true;
            this.output.setValue(this._texture);

            this.needsUpdate = false;
        }

        return this;
    }

    /**
     * Handles renderer resize
     */
    resize(width: number, height: number) {
        this._app.renderer.resize(width, height);
        this.width = width;
        this.height = height;
        this._app.resize();
        return this;
    }
}
