import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import * as THREE from "three";

/**
 * Overlay node initialization options
 *
 * @category Nodes
 */
export interface FXAANodeOptions extends ShaderNodeOptions {}

/**
 * FXAA antialiasing
 *
 * @category Nodes
 */
export class FXAANode extends ShaderNode {
    options: FXAANodeOptions;

    constructor(id: string, options?: FXAANodeOptions) {
        super(id, options, false);

        this.options = options || {};

        // default texture input name is tDiffuse
        // switch this to inputTex
        this.fragmentShader = FXAAShader.fragmentShader
            .split("tDiffuse")
            .join("inputTex");

        this.prepare();
    }

    prepare() {
        super.prepare();

        this.uniforms["resolution"] = {
            value: new THREE.Vector2(1 / 1280, 1 / 720),
        };

        return this;
    }

    resize(width: number, height: number) {
        super.resize(width, height);

        // update resolution uniform with current viewport size
        this.uniforms["resolution"].value.set(1 / width, 1 / height);

        return this;
    }
}
