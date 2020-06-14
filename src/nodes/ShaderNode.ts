import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";
import defaultUniforms from "../shaders/defaultUniforms";
import { IUniform, WebGLRenderTarget } from "three";
import Profiler from "../core/Profiler";
import { UniformNode } from "./UniformNode";

const defaultVertexShader = require("../shaders/default.vert");
const defaultFragmentShader = require("../shaders/defaultPost.frag");

export interface ShaderNodeOptions extends NodeOptions {
    /**
     * GLSL code for the vertex shader of this node
     */
    vertexShader?: string;

    /**
     * GLSL code for the fragment shader of this node
     */
    fragmentShader?: string;

    /**
     * Whether to only render this node when needsUpdate is true
     */
    manualRender?: boolean;

    uniforms?: { [key: string]: IUniform };
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
     * Uniforms passed to constructor as option
     */
    customUniforms?: { [key: string]: IUniform } = {};

    /**
     * Shader uniforms
     */
    uniforms: { [key: string]: IUniform } = {};

    /**
     * Renderer where this node will be included and rendered
     */
    nodeRenderer: NodeRenderer;

    /**
     * Render target for this node
     */
    target: WebGLRenderTarget;

    /**
     * Whether to render this node only when needsUpdate is true
     */
    manualRender?: boolean;

    /**
     * Whether to rerender this node on the next pass (for manual render)
     */
    needsUpdate: boolean = true;

    constructor(
        id: string,
        nodeRenderer: NodeRenderer,
        options?: ShaderNodeOptions,
        prepare: boolean = true
    ) {
        super(id, options);

        options = options || {};
        this.vertexShader = options.vertexShader || defaultVertexShader;
        this.fragmentShader = options.fragmentShader || defaultFragmentShader;

        this.nodeRenderer = nodeRenderer;
        this.target = new THREE.WebGLRenderTarget(
            this.nodeRenderer.width,
            this.nodeRenderer.height
        );

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100);

        this.manualRender = options?.manualRender;

        this.customUniforms = options.uniforms;

        prepare && this.prepare();
    }

    /**
     * Prepares the shader for rendering
     */
    prepare() {
        super.prepare();

        Profiler.register(this);

        // (re)initialize shader uniforms
        let uniforms: { [key: string]: IUniform } = {
            ...defaultUniforms,
            ...this.customUniforms,
        };
        for (let key in this.inputs) {
            if (!uniforms[key])
                uniforms[key] = { value: this.inputs[key].getValue() };
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
    update(totalTime: number, deltaTime: number) {
        super.update(totalTime, deltaTime);

        // update default uniforms
        this.uniforms["iTime"].value = totalTime;
        this.uniforms["iResolution"].value.set(
            this.nodeRenderer.width,
            this.nodeRenderer.height,
            1
        );

        // update node connection uniforms
        for (let key in this.inputs) {
            if (!this.uniforms[key])
                this.uniforms[key] = { value: this.inputs[key].getValue() };
            else this.uniforms[key].value = this.inputs[key].getValue();
        }

        return this;
    }

    /**
     * Renders shader
     */
    render() {
        super.render();

        let initTime = performance.now();

        if (!this.manualRender || this.needsUpdate) {
            let renderer = this.nodeRenderer.renderer;

            // render to a render target
            renderer.setRenderTarget(this.target);
            renderer.clear(true, true, true);
            renderer.render(this.scene, this.camera);

            // update output connection
            this.output.setValue(this.target.texture);

            this.needsUpdate = false;
        }

        let finalTime = performance.now();

        Profiler.update(this, finalTime - initTime);

        return this;
    }

    /**
     * Handles renderer resize
     */
    resize() {
        this.target.setSize(this.nodeRenderer.width, this.nodeRenderer.height);

        return this;
    }

    /**
     * Wrapper over UniformNode creation to reduce boilerplate
     */
    uniform(
        uniformID: string,
        value: any,
        alias?: string,
        hide: boolean = false
    ) {
        let node = new UniformNode(uniformID, {
            value,
            gui: { alias: alias || uniformID, hide },
        });
        this.addInput(node);
        return this;
    }
}
