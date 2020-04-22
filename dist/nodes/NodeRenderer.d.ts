import * as THREE from "three";
import { Viewport } from "../Viewport";
import { NodeGraph } from "./NodeGraph";
import { Node } from "./Node";
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
export declare class NodeRenderer {
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
    };
    constructor(options?: NodeRendererOptions);
    /**
     * Updates the renderer's nodes
     *
     * @param time
     */
    update(time: number): void;
    /**
     * Renders the node graph onto the screen
     */
    render(): void;
    /**
     * Creates a new render target for rendering a node
     */
    createRenderTarget(): THREE.WebGLRenderTarget;
    /**
     * Retrieves the next available render target, creates one if one is not available
     */
    getRenderTarget(): THREE.WebGLRenderTarget;
    /**
     * Resets the render target pointer in order to reutilize render targets after a render
     */
    withdrawRenderTargets(): void;
    /**
     * Handles renderer resize
     */
    onResize(): void;
    /**
     * Connects a node to the root node of the node graph for rendering
     *
     * @param node
     */
    connectToScreen(node: Node): void;
}
//# sourceMappingURL=NodeRenderer.d.ts.map