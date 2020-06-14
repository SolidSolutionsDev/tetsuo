import * as THREE from "three";

import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { NodeRenderer } from "../NodeRenderer";
import { Shaders } from "../../shaders";

export interface FogNodeOptions extends ShaderNodeOptions {
    /**
     * Default fog near setting
     */
    near?: number;

    /**
     * Default fog far setting
     */
    far?: number;
}

export class FogNode extends ShaderNode {
    options: FogNodeOptions;

    constructor(id: string, options?: FogNodeOptions) {
        super(id, options, false);

        this.options = options || {};

        this.fragmentShader = [
            Shaders.depth,
            /* glsl */ `
                varying vec2 vUv;
                uniform float iTime;
                uniform DiffuseAndDepth inputTex;
                uniform float near;
                uniform float far;

                void main() {
                    float d = .5 - readDepth(inputTex.depth, vUv, near, far);
                    vec4 t = texture2D(inputTex.diffuse, vUv);
                    gl_FragColor = vec4(d * t);
                }
            `,
        ].join("\n");

        this.prepare();
    }

    prepare() {
        super.prepare();

        this.uniforms["near"] = { value: this.options.near || 0.1 };
        this.uniforms["far"] = { value: this.options.far || 100 };

        return this;
    }
}
