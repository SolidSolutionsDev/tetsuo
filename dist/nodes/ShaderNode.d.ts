import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";
import { IUniform } from "three";
export interface ShaderNodeOptions extends NodeOptions {
    vertexShader?: string;
    fragmentShader?: string;
}
/**
 * Pixel shader node
 */
export declare class ShaderNode extends Node {
    /**
     * Internal three.js scene
     * Used for rendering shader
     */
    scene: THREE.Scene;
    /**
     * Internal three.js camera
     * Used for rendering shader
     */
    camera: THREE.OrthographicCamera;
    /**
     * Quad where the shader is applied on for rendering
     */
    quad: THREE.Mesh;
    /**
     * Shader's vertex code
     */
    vertexShader: string;
    /**
     * Shader's fragment code
     */
    fragmentShader: string;
    /**
     * Shader uniforms
     */
    uniforms: {
        [key: string]: IUniform;
    };
    /**
     * Renderer where this node will be included and rendered
     */
    nodeRenderer: NodeRenderer;
    constructor(id: string, nodeRenderer: NodeRenderer, options?: ShaderNodeOptions);
    /**
     * Prepares the shader for rendering
     */
    prepare(): this;
    /**
     * Updates shader's uniforms
     *
     * @param time - Current clock time
     */
    update(time: number): this;
    /**
     * Renders shader
     */
    render(): this;
}
//# sourceMappingURL=ShaderNode.d.ts.map