import * as PIXI from "pixi.js";
import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";

export interface PIXINodeOptions extends NodeOptions {}

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

    constructor(id: string, nodeRenderer: NodeRenderer, options?: PIXINodeOptions) {
        super(id, options);

        this.nodeRenderer = nodeRenderer;

        this.app = new PIXI.Application({
            width: this.nodeRenderer.viewport.width,
            height: this.nodeRenderer.viewport.height,
            resizeTo: this.nodeRenderer.viewport.domElement,
            autoStart: false,
            transparent: true,
            antialias: true,
        });

        this.texture = new THREE.CanvasTexture(this.app.view);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
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
        this.app.render();
        this.texture.needsUpdate = true;
        this.output.setValue(this.texture);
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
