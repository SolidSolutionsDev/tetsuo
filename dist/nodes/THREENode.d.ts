import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";
export interface THREENodeOptions extends NodeOptions {
}
/**
 * THREE.js scene node
 */
export declare class THREENode extends Node {
    /**
     * Renderer where this node will be included and rendered
     */
    nodeRenderer: NodeRenderer;
    /**
     * Internal three.js scene
     */
    scene: THREE.Scene;
    /**
     * Internal three.js camera
     */
    camera: THREE.PerspectiveCamera;
    constructor(id: string, nodeRenderer: NodeRenderer, options?: THREENodeOptions);
    /**
     * Adds a three.js object to the internal scene of the node
     *
     * @param object
     */
    add(object: any): this;
    /**
     * Renders the node to an output connection
     */
    render(): this;
    /**
     * Handles renderer resize
     */
    resize(): this;
}
//# sourceMappingURL=THREENode.d.ts.map