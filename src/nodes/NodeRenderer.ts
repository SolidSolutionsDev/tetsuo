import * as THREE from "three";
import { Viewport } from "../Viewport";
import { NodeGraph } from "./NodeGraph";
import { Node } from "./Node";
import { ShaderNode } from "./ShaderNode";

export interface NodeRendererOptions {
    /**
     * Element where the renderer will drop his canvas
     */
    viewportElement?: HTMLElement;

    /**
     * Whether to use antialias when rendering
     */
    antialias?: boolean;

    /**
     * Whether renderer background is transparent
     */
    alpha?: boolean;
}

/**
 * Node-based renderer.
 */
export class NodeRenderer {
    /**
     * Viewport element handler
     */
    viewport: Viewport;

    /**
     * Internal WebGL renderer
     */
    renderer: THREE.WebGLRenderer;

    /**
     * Graph of nodes attached to this renderer
     */
    nodeGraph: NodeGraph;

    /**
     * Internal threejs camera for rendering
     */
    camera: THREE.OrthographicCamera;

    /**
     * Internal threejs scene for rendering
     */
    scene: THREE.Scene;

    /**
     * Quad where the result of the node graph is applied on when rendering
     */
    quad: THREE.Mesh;

    /**
     * Quad's material
     */
    material: THREE.MeshBasicMaterial;

    /**
     * Render target pool for easy management
     */
    targetPool: {
        targets: THREE.WebGLRenderTarget[];
        used: number;
    } = { targets: [], used: 0 };

    constructor(options?: NodeRendererOptions) {
        // initialize default options
        options = options || {};
        if (options.antialias === undefined) options.antialias = true;
        if (options.alpha === undefined) options.alpha = true;
        let viewport: HTMLElement | null = options.viewportElement || document.getElementById("viewport");

        if (!viewport) {
            throw Error("viewport element not found");
        }

        // initialize viewport handler
        this.viewport = new Viewport(viewport);
        this.viewport.createResizeListener(() => this.onResize());

        // initialize renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: options.antialias,
            alpha: options.alpha,
            canvas: this.viewport.canvas,
        });
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.sortObjects = true;
        this.renderer.autoClear = false;

        // initialize node graph and create the root node
        this.nodeGraph = new NodeGraph();
        this.nodeGraph.setRootNode(new ShaderNode("root", this));

        // setup rendering
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2));
        this.scene.add(this.quad);
        this.material = new THREE.MeshBasicMaterial();
    }

    /**
     * Updates the renderer's nodes
     *
     * @param time
     */
    update(time: number) {
        this.nodeGraph.traverse((node) => node.update(time));
    }

    /**
     * Renders the node graph onto the screen
     */
    render() {
        if (this.nodeGraph.root) {
            this.renderer.clear(true, true, true);

            // traverse the node graph and render each node
            this.nodeGraph.traverse((node) => node.render());

            // render the result to screen
            let map = this.nodeGraph.root.output.getValue() as THREE.Texture;
            this.quad.material = new THREE.MeshBasicMaterial({
                map,
            });
            this.renderer.setRenderTarget(null);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);

            // reset render targets for next render
            this.withdrawRenderTargets();
        }
    }

    /**
     * Creates a new render target for rendering a node
     */
    createRenderTarget() {
        let target = new THREE.WebGLRenderTarget(this.viewport.width, this.viewport.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        });

        return target;
    }

    /**
     * Retrieves the next available render target, creates one if one is not available
     */
    getRenderTarget() {
        let target = this.targetPool.targets[this.targetPool.used];

        if (!target) {
            target = this.createRenderTarget();
            this.targetPool.targets[this.targetPool.used] = target;
        }

        this.targetPool.used++;

        target.texture.repeat.set(1, 1);
        target.texture.offset.set(0, 0);

        return target;
    }

    /**
     * Resets the render target pointer in order to reutilize render targets after a render
     */
    withdrawRenderTargets() {
        this.targetPool.used = 0;
    }

    /**
     * Handles renderer resize
     */
    onResize() {
        this.renderer.setSize(this.viewport.width, this.viewport.height);

        // resize each render target
        this.targetPool.targets.forEach((target) => target.setSize(this.viewport.width, this.viewport.height));

        // resize each node
        this.nodeGraph.traverse((node) => node.resize());

        // render everything with the new size
        this.render();
    }

    /**
     * Connects a node to the root node of the node graph for rendering
     *
     * @param node
     */
    connectToScreen(node: Node) {
        if (this.nodeGraph.root) {
            // change node ID to match the uniform in the root node fragment shader
            node.id = "tDiffuse";

            node.connectTo(this.nodeGraph.root);
        }
    }
}
