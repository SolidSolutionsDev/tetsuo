import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { Shaders } from "../../shaders";

/**
 * Displace glitch node initialization options
 *
 * @category Nodes
 */
export interface DisplaceGlitchNodeOptions extends ShaderNodeOptions {
    /**
     * Number of vertical divisions
     */
    verticalDivs?: number;

    /**
     * Number of horizontal divisions
     */
    horizontalDivs?: number;

    /**
     * Speed of the glitch effect
     */
    speed?: number;

    /**
     * Amount of the glitch effect
     */
    amount?: number;
}

/**
 * Displace glitch effect node
 *
 * @category Nodes
 */
export class DisplaceGlitchNode extends ShaderNode {
    options: DisplaceGlitchNodeOptions;

    constructor(id: string, options?: DisplaceGlitchNodeOptions) {
        super(id, options, false);

        this.options = options || {};

        this.fragmentShader = [
            Shaders.hash,
            Shaders.math,

            /* glsl */ `
                uniform float iTime;

                uniform sampler2D inputTex;
                uniform float speed;
                uniform float amount;
                uniform float horizontalDivs;
                uniform float verticalDivs;

                varying vec2 vUv;

                void main() {
                    vec2 p = vUv + floor(iTime * speed);
                    vec2 fl = vec2(floor(p.x * horizontalDivs), floor(p.y * verticalDivs));
                    float c = sat(hash12(fl), 0.9, 0., 1.);
                    vec4 t = texture2D(inputTex, vUv + c * .005);
                    
                    gl_FragColor = t * amount + t * c * 0.9 * (1. - amount);
                }
            `,
        ].join("\n");

        this.prepare();
    }

    prepare() {
        super.prepare();

        this.uniforms["amount"] = { value: this.options.amount || 0.9 };
        this.uniforms["speed"] = { value: this.options.speed || 15 };
        this.uniforms["verticalDivs"] = {
            value: this.options.verticalDivs || 50,
        };
        this.uniforms["horizontalDivs"] = {
            value: this.options.horizontalDivs || 10,
        };

        return this;
    }
}
