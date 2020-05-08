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
}

/**
 * pixi.js scene node
 */
export class PIXINode extends Node {
    /**
     * Renderer where this node will be included and rendered
     */
    nodeRenderer: NodeRenderer;

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

    constructor(id: string, nodeRenderer: NodeRenderer, options?: PIXINodeOptions) {
        super(id, options);

        this.nodeRenderer = nodeRenderer;

        PIXI.utils.skipHello();

        this.fixedSize = !!(options?.width || options?.height);

        this.manualRender = options?.manualRender;

        this.app = new PIXI.Application({
            width: options?.width || this.nodeRenderer.viewport.width,
            height: options?.height || this.nodeRenderer.viewport.height,
            resizeTo: this.fixedSize ? undefined : this.nodeRenderer.viewport.domElement,
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
    resize() {
        this.app.resize();
        return this;
    }
}
