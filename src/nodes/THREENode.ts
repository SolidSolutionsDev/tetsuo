import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";

export interface THREENodeOptions extends NodeOptions {
    depthBuffer: boolean;
}

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

    depthBuffer: boolean = false;

    constructor(id: string, nodeRenderer: NodeRenderer, options?: THREENodeOptions) {
        super(id, options);

        this.scene = new THREE.Scene();

        // TODO add camera configuration as node input
        this.camera = new THREE.PerspectiveCamera(70, nodeRenderer.viewport.ratio, 0.01, 50);
        this.camera.position.z = 4;

        this.nodeRenderer = nodeRenderer;

        this.depthBuffer = !!options && options.depthBuffer;
        if (this.depthBuffer) {
            this.output.value = { diffuse: null, depth: null };
        }
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

        target.depthBuffer = this.depthBuffer;
        if (this.depthBuffer) {
            target.stencilBuffer = false;
            target.depthTexture = new THREE.DepthTexture(
                this.nodeRenderer.viewport.width,
                this.nodeRenderer.viewport.height
            );
            target.depthTexture.format = THREE.DepthFormat;
            target.depthTexture.type = THREE.UnsignedShortType;
        }

        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);

        // update output connection
        this.output.setValue(
            this.depthBuffer ? { diffuse: target.texture, depth: target.depthTexture } : target.texture
        );

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
