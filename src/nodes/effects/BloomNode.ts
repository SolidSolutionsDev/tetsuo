import * as THREE from "three";

import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { NodeRenderer } from "../NodeRenderer";
import { Shaders } from "../../shaders";

export interface BloomNodeOptions extends ShaderNodeOptions {
    /**
     * Size of the input texture
     */
    texSize?: THREE.Vector2;

    /**
     * Default bloom separation setting
     */
    separation?: number;

    /**
     * Default bloom threshold setting
     */
    threshold?: number;

    /**
     * Default bloom amount setting
     */
    amount?: number;
}

export class BloomNode extends ShaderNode {
    options: BloomNodeOptions;

    constructor(id: string, nodeRenderer: NodeRenderer, options?: BloomNodeOptions) {
        super(id, nodeRenderer, options, false);

        this.options = options || {};

        this.fragmentShader = [
            Shaders.filters,
            /* glsl */ `
                varying vec2 vUv;
                uniform float iTime;
                uniform sampler2D inputTex;
                uniform vec2 texSize;
                uniform float separation;
                uniform float threshold;
                uniform float amount;

                void main() {
                    gl_FragColor = bloom(inputTex, texSize, vUv, separation, threshold, amount);
                }
            `,
        ].join("\n");

        this.prepare();
    }

    prepare() {
        super.prepare();

        this.uniforms["texSize"] = { value: this.options.texSize || new THREE.Vector2(1280, 720) };
        this.uniforms["separation"] = { value: this.options.separation || 6 };
        this.uniforms["threshold"] = { value: this.options.threshold || 0.4 };
        this.uniforms["amount"] = { value: this.options.amount || 2 };

        return this;
    }
}
