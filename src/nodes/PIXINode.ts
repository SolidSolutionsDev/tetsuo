import * as PIXI from "pixi.js";
import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";
import Profiler from "../core/Profiler";

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
 * pixi.js scene node
 */
export class PIXINode extends Node {
    width: number = 0;
    height: number = 0;

    /**
     * Internal PIXI application
     */
    app: PIXI.Application;

    /**
     * Texture that is used for output
     */
    texture: THREE.CanvasTexture;

    /**
     * Whether to render this node only when needsUpdate is true
     */
    manualRender?: boolean;

    /**
     * Whether to rerender this node on the next pass (for manual render)
     */
    needsUpdate: boolean = true;

    /**
     * Whether the size for the internal renderer is fixed (passed to the constructor)
     */
    fixedSize: boolean = false;

    constructor(id: string, options?: PIXINodeOptions) {
        super(id, options);

        PIXI.utils.skipHello();

        this.manualRender = options?.manualRender;

        this.fixedSize = !!(options?.width || options?.height);

        this.width = options?.width || 0;
        this.height = options?.height || 0;

        this.app = new PIXI.Application({
            width: this.width,
            height: this.height,
            resizeTo: options?.viewportElement
                ? undefined
                : options?.viewportElement,
            autoStart: false,
            transparent: true,
            antialias: true,
        });

        this.texture = new THREE.CanvasTexture(this.app.view);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;

        Profiler.register(this);
    }

    /**
     * Adds a PIXI object to the main container
     *
     * @param obj
     */
    add(obj: PIXI.DisplayObject) {
        this.app.stage.addChild(obj);
    }

    /**
     * Renders the node to an output connection
     */
    render() {
        let initTime = performance.now();

        if (!this.manualRender || this.needsUpdate) {
            this.app.render();
            this.texture.needsUpdate = true;
            this.output.setValue(this.texture);

            this.needsUpdate = false;
        }

        let finalTime = performance.now();

        Profiler.update(this, finalTime - initTime);

        return this;
    }

    /**
     * Handles renderer resize
     */
    resize(width: number, height: number) {
        this.app.renderer.resize(width, height);
        this.width = width;
        this.height = height;
        this.app.resize();
        return this;
    }
}
