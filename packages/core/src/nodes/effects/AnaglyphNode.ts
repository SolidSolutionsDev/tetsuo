import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { Shaders } from "../../shaders";
import { uniqueID } from "../../utils/general";

/**
 * Anaglyph node initialization options
 *
 * @category Nodes
 */
export interface AnaglyphNodeOptions extends ShaderNodeOptions {
    /**
     * Default anaglyph amount setting
     */
    amount?: number;
}

/**
 * Anaglyph effect node
 *
 * @category Nodes
 */
export class AnaglyphNode extends ShaderNode {
    options: AnaglyphNodeOptions;

    constructor(options?: AnaglyphNodeOptions) {
        super(
            { ...options, id: options?.id || uniqueID("AnaglyphNode_") },
            false
        );

        this.options = options || {};

        this.fragmentShader = [
            Shaders.filters,
            /* glsl */ `
                varying vec2 vUv;
                uniform float iTime;
                uniform sampler2D inputTex;
                uniform float amount;

                void main() { 
                    gl_FragColor = anaglyph(inputTex, vUv, amount);
                }
            `,
        ].join("\n");

        this.prepare();
    }

    prepare() {
        super.prepare();

        // setup uniform default values
        this.uniforms["amount"] = { value: this.options.amount || 0.015 };

        return this;
    }
}
