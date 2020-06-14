import * as THREE from "three";
import { Viewport } from "../core/Viewport";
import { NodeGraph } from "./NodeGraph";
import { Node } from "./Node";
import { ShaderNode } from "./ShaderNode";

export interface NodeRendererOptions {
    /**
     * Element where the renderer will drop his canvas
     */
    viewportElement?: HTMLElement;
    noViewport?: boolean;

    /**
     * Whether to use antialias when rendering
     */
    antialias?: boolean;

    /**
     * Whether renderer background is transparent
     */
    alpha?: boolean;

    fixedSize?: boolean;
    width?: number;
    height?: number;
    autoClear?: boolean;
}

/**
 * Node-based renderer.
 */
export class NodeRenderer {
    /**
     * Viewport element handler
     */
    viewport?: Viewport;

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
     * Whether the size for the renderer is fixed
     */
    fixedSize: boolean = false;
    width: number;
    height: number;

    constructor(options?: NodeRendererOptions) {
        // initialize default options
        options = options || {};
        if (options.antialias === undefined) options.antialias = true;
        if (options.alpha === undefined) options.alpha = true;

        this.fixedSize = !!options?.fixedSize;
        this.width = options?.width || 0;
        this.height = options?.height || 0;

        let viewport: HTMLElement | null = null;

        if (!options.noViewport && options.viewportElement) {
            viewport = options.viewportElement;
        } else if (!options.noViewport && document.getElementById("viewport")) {
            viewport = document.getElementById("viewport");
        }

        // if no viewport found, fixed size is mandatory
        if (!viewport) {
            this.fixedSize = true;
        } else {
            // initialize viewport handler
            this.viewport = new Viewport(viewport);
            this.viewport.createResizeListener(() => this.onResize());
        }

        // check for size options if needed
        if (
            this.fixedSize &&
            (!options.width || !options.height) &&
            !this.viewport
        ) {
            throw new Error(
                "Node renderer - Fixed size set to true but no width/height defined"
            );
        }

        let canvas;
        if (options.noViewport) {
            canvas = document.createElement("canvas");
            canvas.style.display = "none";
            document.body.appendChild(canvas);
        } else {
            canvas = this.viewport?.canvas;
        }

        // initialize renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: options.antialias,
            alpha: options.alpha,
            canvas,
        });

        // set renderer size depending on size options
        if (this.fixedSize && options.width && options.height) {
            this.renderer.setSize(options.width, options.height);
            this.width = options.width;
            this.height = options.height;
        } else if (this.viewport) {
            this.renderer.setSize(this.viewport.width, this.viewport.height);
            this.width = this.viewport.width;
            this.height = this.viewport.height;
        }

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.sortObjects = true;
        this.renderer.autoClear = !!options?.autoClear;

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
     */
    update(totalTime: number, deltaTime: number, fromNode?: Node) {
        this.nodeGraph.traverse(
            (node) => node.update(totalTime, deltaTime),
            fromNode
        );
    }

    /**
     * Change size of renderer
     *
     * @param width
     * @param height
     */
    setSize(width: number, height: number) {
        if (this.fixedSize) {
            this.width = width;
            this.height = height;

            this.onResize();
        }
    }

    /**
     * Handles renderer resize
     */
    onResize() {
        // set renderer size depending on size options
        if (this.fixedSize && this.width && this.height) {
            this.renderer.setSize(this.width, this.height);
        } else if (this.viewport) {
            this.renderer.setSize(this.viewport.width, this.viewport.height);
            this.width = this.viewport.width;
            this.height = this.viewport.height;
        }

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
            this.nodeGraph.root.addInput(node, "tDiffuse");
        }
    }

    /**
     * Renders the node graph onto the screen
     */
    render(fromNode?: Node) {
        if (fromNode) {
            this.nodeGraph.traverse((node) => node.render(), fromNode);
        } else if (this.nodeGraph.root) {
            // traverse the node graph and render each node
            this.nodeGraph.traverse((node) => node.render());

            // render the result to screen
            let map = this.nodeGraph.root.output.getValue() as THREE.Texture;
            this.quad.material = new THREE.MeshBasicMaterial({
                map,
            });
            this.renderer.setRenderTarget(null);
            this.renderer.clear(true, true, true);
            this.renderer.render(this.scene, this.camera);
        }
    }
}
