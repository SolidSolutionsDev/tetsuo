import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";

export interface THREENodeOptions extends NodeOptions {}

/**
 * THREE.js scene node
 */
export class THREENode extends Node {
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

    constructor(id: string, nodeRenderer: NodeRenderer, options?: THREENodeOptions) {
        super(id, options);

        this.scene = new THREE.Scene();

        // TODO add camera configuration as node input
        this.camera = new THREE.PerspectiveCamera(45, nodeRenderer.viewport.ratio, 1, 10000);
        this.camera.position.z = 100;

        this.nodeRenderer = nodeRenderer;
    }

    /**
     * Adds a three.js object to the internal scene of the node
     *
     * @param object
     */
    add(object: any) {
        this.scene.add(object);
        return this;
    }

    /**
     * Renders the node to an output connection
     */
    render() {
        let renderer = this.nodeRenderer.renderer;

        // render to a render target
        let target = this.nodeRenderer.getRenderTarget();
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);

        // update output connection
        this.output.setValue(target.texture);

        return this;
    }

    /**
     * Handles renderer resize
     */
    resize() {
        this.camera.aspect = this.nodeRenderer.viewport.ratio;
        this.camera.updateProjectionMatrix();

        return this;
    }
}
