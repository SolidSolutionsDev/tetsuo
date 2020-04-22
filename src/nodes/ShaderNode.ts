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

export class ShaderNode extends Node {
    scene: THREE.Scene;

    camera: THREE.OrthographicCamera;

    quad: THREE.Mesh = new THREE.Mesh();

    vertexShader: string = defaultVertexShader;
    fragmentShader: string = defaultFragmentShader;

    uniforms: { [key: string]: IUniform } = {};

    nodeRenderer: NodeRenderer;

    constructor(id: string, nodeRenderer: NodeRenderer, options?: ShaderNodeOptions) {
        super(id, options);

        options = options || {};

        this.nodeRenderer = nodeRenderer;

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 100);

        this.vertexShader = options.vertexShader || defaultVertexShader;

        this.fragmentShader = options.fragmentShader || defaultFragmentShader;

        this.prepare();
    }

    prepare() {
        let uniforms = { ...defaultUniforms };

        for (let key in this.inputs) {
            if (!uniforms[key]) uniforms[key] = { value: this.inputs[key].getValue() };
        }

        this.quad = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2, 2),
            new THREE.ShaderMaterial({
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                uniforms,
            })
        );

        this.uniforms = (this.quad.material as THREE.ShaderMaterial).uniforms;

        this.scene.add(this.quad);
    }

    update(time: number) {
        super.update(time);

        this.uniforms["iTime"].value = time;
        this.uniforms["iResolution"].value.set(this.nodeRenderer.viewport.width, this.nodeRenderer.viewport.height, 1);

        for (let key in this.inputs) {
            if (!this.uniforms[key]) this.uniforms[key] = { value: this.inputs[key].getValue() };
            else this.uniforms[key].value = this.inputs[key].getValue();
        }
    }

    render() {
        let renderer = this.nodeRenderer.renderer;
        let target = this.nodeRenderer.getRenderTarget();
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
        this.output.setValue(target.texture);
    }
}
