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
    constructor(id: string, nodeRenderer: NodeRenderer, options?: AnaglyphNodeOptions) {
        super(id, nodeRenderer, options, false);

        this.fragmentShader = [
            Shaders.color,
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

        this.uniforms["amount"] = { value: options?.amount || 0.015 };
    }
}
