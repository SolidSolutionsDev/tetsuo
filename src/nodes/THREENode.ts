import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";

export interface THREENodeOptions extends NodeOptions {
    /**
     * Whether this node will render and output a depth texture
     */
    depthBuffer?: boolean;

    /**
     * Whether to create orbit controls for the scene camera
     */
    orbitControls?: boolean;

    manualRender?: boolean;
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

    controls?: OrbitControls;

    /**
     * Whether this node will render and output a depth texture
     * If true, the output value is a struct containing 2 textures - diffuse and depth
     */
    depthBuffer: boolean = false;

    /**
     * Render target for this node
     */
    target: THREE.WebGLRenderTarget;

    /**
     * Whether to render this node only when needsUpdate is true
     */
    manualRender?: boolean;

    /**
     * Whether to rerender this node on the next pass (for manual render)
     */
    needsUpdate: boolean = true;

    constructor(id: string, nodeRenderer: NodeRenderer, options?: THREENodeOptions) {
        super(id, options);

        this.scene = new THREE.Scene();

        // TODO add camera configuration as node input
        this.camera = new THREE.PerspectiveCamera(45, nodeRenderer.viewport.ratio, 0.1, 50);
        this.camera.position.z = 4;

        this.nodeRenderer = nodeRenderer;
        this.target = new THREE.WebGLRenderTarget(this.nodeRenderer.viewport.width, this.nodeRenderer.viewport.height);

        if (options && options.orbitControls) {
            this.controls = new OrbitControls(this.camera, this.nodeRenderer.viewport.domElement);
        }

        // if depth texture is active, create it and setup the output
        this.depthBuffer = !!options && !!options.depthBuffer;
        if (this.depthBuffer) {
            this.output.value = { diffuse: null, depth: null };
            this.target.depthTexture = new THREE.DepthTexture(
                this.nodeRenderer.viewport.width,
                this.nodeRenderer.viewport.height
            );
        }

        this.manualRender = options?.manualRender;
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
        if (!this.manualRender || this.needsUpdate) {
            let renderer = this.nodeRenderer.renderer;

            renderer.setRenderTarget(this.target);
            renderer.clear(true, true, true);
            renderer.render(this.scene, this.camera);

            // update output connection
            this.output.setValue(
                this.depthBuffer
                    ? { diffuse: this.target.texture, depth: this.target.depthTexture }
                    : this.target.texture
            );

            this.needsUpdate = false;
        }

        return this;
    }

    /**
     * Handles renderer resize
     */
    resize() {
        this.camera.aspect = this.nodeRenderer.viewport.ratio;
        this.camera.updateProjectionMatrix();
        this.target.setSize(this.nodeRenderer.viewport.width, this.nodeRenderer.viewport.height);

        return this;
    }
}
