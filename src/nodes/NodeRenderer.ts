import * as THREE from "three";
import { Viewport } from "../core/Viewport";
import { NodeGraph } from "./NodeGraph";
import { Node } from "./Node";
import { ShaderNode } from "./ShaderNode";

/**
 * Node renderer initialization options
 *
 * @category Nodes
 */
export interface NodeRendererOptions {
    /**
     * Element where the renderer will drop his canvas
     */
    viewportElement?: HTMLElement;

    /**
     * Whether to run the renderer without a viewport.
     * This skips the handling of the canvas and viewport element.
     * The output is accessible using the node graph's root node texture or quad.
     */
    noViewport?: boolean;

    /**
     * Whether to use antialias when rendering
     */
    antialias?: boolean;

    /**
     * Whether renderer background is transparent
     */
    alpha?: boolean;

    /**
     * Whether the node renderer has fixed size output
     */
    fixedSize?: boolean;

    /**
     * Width of the node renderer output
     */
    width?: number;

    /**
     * Height of the node renderer output
     */
    height?: number;
    autoClear?: boolean;
}

/**
 * Node-based renderer
 *
 * @category Nodes
 */
export class NodeRenderer {
    /**
     * Viewport element handler
     */
    viewport?: Viewport;

    /**
     * Internal WebGL renderer
     */
    glRenderer: THREE.WebGLRenderer;

    /**
     * Graph of nodes attached to this renderer
     */
    private _nodeGraph: NodeGraph;

    /**
     * Collection of nodes for the renderer to render that are not attached to the main graph.
     * Used for rendering materials
     */
    private _nonRootNodes: Node[] = [];

    /**
     * Internal threejs camera for rendering
     */
    private _camera: THREE.OrthographicCamera;

    /**
     * Internal threejs scene for rendering
     */
    private _scene: THREE.Scene;

    /**
     * Quad where the result of the node graph is applied on when rendering
     */
    private _quad: THREE.Mesh;

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
        this.glRenderer = new THREE.WebGLRenderer({
            antialias: options.antialias,
            alpha: options.alpha,
            canvas,
        });

        // set renderer size depending on size options
        if (this.fixedSize && options.width && options.height) {
            this.glRenderer.setSize(options.width, options.height);
            this.width = options.width;
            this.height = options.height;
        } else if (this.viewport) {
            this.glRenderer.setSize(this.viewport.width, this.viewport.height);
            this.width = this.viewport.width;
            this.height = this.viewport.height;
        }

        this.glRenderer.setClearColor(0x000000, 0);
        this.glRenderer.sortObjects = true;
        this.glRenderer.autoClear = !!options?.autoClear;

        // initialize node graph and create the root node
        this._nodeGraph = new NodeGraph();
        this._nodeGraph.setRootNode(new ShaderNode("root"));

        // setup rendering
        this._camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this._scene = new THREE.Scene();
        this._quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2));
        this._scene.add(this._quad);
    }

    /**
     * Updates the renderer's nodes
     */
    update(
        totalTime: number,
        deltaTime: number,
        frameCount?: number,
        fromNode?: Node
    ) {
        // update non-root nodes
        this._nonRootNodes.forEach((n) =>
            this._nodeGraph.traverse(
                (node) => node.update(totalTime, deltaTime, frameCount),
                n,
                [],
                true
            )
        );

        this._nodeGraph.traverse(
            (node) => node.update(totalTime, deltaTime, frameCount),
            fromNode,
            [],
            true
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
            this.glRenderer.setSize(this.width, this.height);
        } else if (this.viewport) {
            this.glRenderer.setSize(this.viewport.width, this.viewport.height);
            this.width = this.viewport.width;
            this.height = this.viewport.height;
        }

        // resize non-root nodes
        this._nonRootNodes.forEach((n) =>
            this._nodeGraph.traverse(
                (node) => node.resize(this.width, this.height),
                n,
                [],
                true
            )
        );

        // resize each node
        this._nodeGraph.traverse(
            (node) => node.resize(this.width, this.height),
            undefined,
            [],
            true
        );

        // render everything with the new size
        this.render();
    }

    /**
     * Connects a node to the root node of the node graph for rendering
     *
     * @param node
     */
    connectToScreen(node: Node) {
        if (this._nodeGraph.root) {
            this._nodeGraph.root.addInput(node, "tDiffuse");

            // traverse all nodes and do an initial render
            // this prevents first render bugs
            this._nodeGraph.traverse(
                (n) => {
                    n.resize(this.width, this.height);
                    n.render(this);
                },
                undefined,
                [],
                true
            );
        }
    }

    /**
     * Connects a node separated from the main graph to be rendered by this renderer
     *
     * @param node
     */
    connectNonRootNode(node: Node) {
        this._nonRootNodes.push(node);

        // traverse all nodes and do an initial render
        // this prevents first render bugs
        this._nodeGraph.traverse(
            (n) => {
                n.resize(this.width, this.height);
                n.render(this);
            },
            node,
            [],
            true
        );
    }

    /**
     * Renders the node graph onto the screen
     */
    render(fromNode?: Node) {
        if (fromNode) {
            this._nodeGraph.traverse((node) => node.render(this), fromNode);
        } else if (this._nodeGraph.root) {
            // render non-root nodes
            this._nonRootNodes.forEach((n) =>
                this._nodeGraph.traverse((node) => node.render(this), n)
            );

            // traverse the node graph and render each node
            this._nodeGraph.traverse((node) => node.render(this));

            // render the result to screen
            let map = this._nodeGraph.root.output.getValue() as THREE.Texture;
            this._quad.material = new THREE.MeshBasicMaterial({
                map,
            });
            this.glRenderer.setRenderTarget(null);
            this.glRenderer.clear(true, true, true);
            this.glRenderer.render(this._scene, this._camera);
        }
    }
}
