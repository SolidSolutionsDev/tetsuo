import * as THREE from "three";

import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { Shaders } from "../../shaders";
import { uniqueID } from "../../utils/general";

/**
 * Box blur node initialization options
 *
 * @category Nodes
 */
export interface BoxBlurNodeOptions extends ShaderNodeOptions {
    /**
     * Size of the input texture
     */
    texSize?: THREE.Vector2;

    /**
     * Default separation setting
     */
    separation?: number;
}

/**
 * Box blur effect node
 *
 * @category Nodes
 */
export class BoxBlurNode extends ShaderNode {
    options: BoxBlurNodeOptions;

    constructor(options?: BoxBlurNodeOptions) {
        super(
            { ...options, id: options?.id || uniqueID("BoxBlurNode_") },
            false
        );

        this.options = options || {};

        this.fragmentShader = [
            Shaders.filters,
            /* glsl */ `
                varying vec2 vUv;
                uniform float iTime;
                uniform sampler2D inputTex;
                uniform vec2 texSize;
                uniform float separation;

                void main() {
                    gl_FragColor = boxblur(inputTex, texSize, vUv, separation);
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

        return this;
    }

    resize(width: number, height: number) {
        super.resize(width, height);

        // update texture size uniform with current viewport size
        this.uniforms["texSize"].value.set(width, height);

        return this;
    }
}
