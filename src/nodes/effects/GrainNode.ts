import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { Shaders } from "../../shaders";
import { uniqueID } from "../../utils/general";

/**
 * Grain node initialization options
 *
 * @category Nodes
 */
export interface GrainNodeOptions extends ShaderNodeOptions {
    /**
     * Default grain amount setting
     */
    amount?: number;
}

/**
 * Grain effect node
 *
 * @category Nodes
 */
export class GrainNode extends ShaderNode {
    options: GrainNodeOptions;

    constructor(options?: GrainNodeOptions) {
        super({ ...options, id: options?.id || uniqueID("GrainNode_") }, false);

        this.options = options || {};

        this.fragmentShader = Shaders.compile(/* glsl */ `
                varying vec2 vUv;
                uniform float amount;
                uniform float iTime;
                uniform sampler2D inputTex;

                float random(vec2 p) {
                    vec2 K1 = vec2(
                        23.14069263277926, // e^pi (Gelfond's constant)
                        2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
                    );
                    return fract( cos( dot(p,K1) ) * 12345.6789 );
                }

                void main() {
                    vec4 color = texture2D(inputTex, vUv);

                    vec2 uvRandom = vUv;
                    uvRandom.y *= random(vec2(uvRandom.y, iTime));
                    
                    color.rgb += random(uvRandom) * amount;

                    gl_FragColor = color;
                }
            `);

        this.prepare();
    }

    prepare() {
        super.prepare();

        // setup uniform default values
        this.uniforms["amount"] = { value: this.options.amount || 0.02 };

        return this;
    }
}
