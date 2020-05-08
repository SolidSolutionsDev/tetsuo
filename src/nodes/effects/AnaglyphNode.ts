import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { NodeRenderer } from "../NodeRenderer";
import { Shaders } from "../../shaders";

export interface AnaglyphNodeOptions extends ShaderNodeOptions {
    /**
     * Default anaglyph amount setting
     */
    amount?: number;
}

export class AnaglyphNode extends ShaderNode {
    options: AnaglyphNodeOptions;

    constructor(id: string, nodeRenderer: NodeRenderer, options?: AnaglyphNodeOptions) {
        super(id, nodeRenderer, options, false);

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
