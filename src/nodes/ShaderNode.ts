import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";
import { defaultUniforms } from "../uniforms";
import { IUniform } from "three";

const defaultVertexShader = require("../shaders/default.vert");
const defaultFragmentShader = require("../shaders/defaultPost.frag");

export interface ShaderNodeOptions extends NodeOptions {
    vertexShader?: string;
    fragmentShader?: string;
}

/**
 * Pixel shader node
 */
export class ShaderNode extends Node {
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
    quad: THREE.Mesh = new THREE.Mesh();

    /**
     * Shader's vertex code
     */
    vertexShader: string = defaultVertexShader;

    /**
     * Shader's fragment code
     */
    fragmentShader: string = defaultFragmentShader;

    /**
     * Shader uniforms
     */
    uniforms: { [key: string]: IUniform } = {};

    /**
     * Renderer where this node will be included and rendered
     */
    nodeRenderer: NodeRenderer;

    constructor(id: string, nodeRenderer: NodeRenderer, options?: ShaderNodeOptions) {
        super(id, options);

        options = options || {};
        this.vertexShader = options.vertexShader || defaultVertexShader;
        this.fragmentShader = options.fragmentShader || defaultFragmentShader;

        this.nodeRenderer = nodeRenderer;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100);

        this.prepare();
    }

    /**
     * Prepares the shader for rendering
     */
    prepare() {
        // (re)initialize shader uniforms
        let uniforms = { ...defaultUniforms };
        for (let key in this.inputs) {
            if (!uniforms[key]) uniforms[key] = { value: this.inputs[key].getValue() };
        }

        // apply shader to fullscreen quad
        this.quad && this.scene.remove(this.quad);
        this.quad = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2, 2),
            new THREE.ShaderMaterial({
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                uniforms,
            })
        );
        this.scene.add(this.quad);

        // save uniforms for updating
        this.uniforms = (this.quad.material as THREE.ShaderMaterial).uniforms;

        return this;
    }

    /**
     * Updates shader's uniforms
     *
     * @param time - Current clock time
     */
    update(time: number) {
        super.update(time);

        // update default uniforms
        this.uniforms["iTime"].value = time;
        this.uniforms["iResolution"].value.set(this.nodeRenderer.viewport.width, this.nodeRenderer.viewport.height, 1);

        // update node connection uniforms
        for (let key in this.inputs) {
            if (!this.uniforms[key]) this.uniforms[key] = { value: this.inputs[key].getValue() };
            else this.uniforms[key].value = this.inputs[key].getValue();
        }

        return this;
    }

    /**
     * Renders shader
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
}
