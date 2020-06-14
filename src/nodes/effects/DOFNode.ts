import * as THREE from "three";

import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { NodeRenderer } from "../NodeRenderer";
import { Shaders } from "../../shaders";

export interface DOFNodeOptions extends ShaderNodeOptions {
    /**
     * Size of the input texture
     */
    texSize?: THREE.Vector2;

    /**
     * Default blur separation setting
     */
    separation?: number;

    /**
     * Default dof near setting
     */
    near?: number;

    /**
     * Default dof far setting
     */
    far?: number;
}

export class DOFNode extends ShaderNode {
    options: DOFNodeOptions;

    constructor(
        id: string,
        nodeRenderer: NodeRenderer,
        options?: DOFNodeOptions
    ) {
        super(id, nodeRenderer, options, false);

        this.options = options || {};

        this.fragmentShader = [
            Shaders.depth,
            Shaders.filters,
            /* glsl */ `
                varying vec2 vUv;
                uniform float iTime;
                uniform DiffuseAndDepth inputTex;
                uniform vec2 texSize;
                uniform float separation;
                uniform float near;
                uniform float far;

                void main() {
                    vec4 blurred = boxblur(inputTex.diffuse, texSize, vUv, separation);
                    vec4 unblurred = texture2D(inputTex.diffuse, vUv);
                    float d = readDepth(inputTex.depth, vUv, near, far);

                    gl_FragColor = mix(unblurred, blurred, d);
                }
            `,
        ].join("\n");

        this.prepare();
    }

    prepare() {
        super.prepare();

        this.uniforms["texSize"] = {
            value: this.options.texSize || new THREE.Vector2(1280, 720),
        };
        this.uniforms["separation"] = { value: this.options.separation || 6 };
        this.uniforms["near"] = { value: this.options.near || 0.1 };
        this.uniforms["far"] = { value: this.options.far || 100 };

        return this;
    }
}
