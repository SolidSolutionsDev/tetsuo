import { ShaderNode, ShaderNodeOptions } from "./ShaderNode";
import { Shaders } from "../shaders";
import { uniqueID } from "../utils/general";

/**
 * Overlay node initialization options
 *
 * @category Nodes
 */
export interface CrossfadeNodeOptions extends ShaderNodeOptions {
    mask?: boolean;
}

/**
 * Overlays two inputs using alpha
 *
 * @category Nodes
 */
export class CrossfadeNode extends ShaderNode {
    constructor(options?: CrossfadeNodeOptions) {
        super(
            { ...options, id: options?.id || uniqueID("CrossfadeNode_") },
            false
        );

        this.fragmentShader = options?.mask
            ? [
                  /* glsl */ `
                varying vec2 vUv;

                uniform sampler2D bgTex; 
                uniform sampler2D fgTex;
                uniform float amount;
                uniform sampler2D maskTex;

                void main() {
                    vec4 bg = texture2D(bgTex, vUv);
                    vec4 fg = texture2D(fgTex, vUv);
                    float mask = texture2D(maskTex, vUv).r;

                    gl_FragColor = mask > amount ? bg : fg;
                }
            `,
              ].join("\n")
            : [
                  /* glsl */ `
                varying vec2 vUv;

                uniform sampler2D bgTex; 
                uniform sampler2D fgTex;
                uniform float amount;

                void main() {
                    vec4 bg = texture2D(bgTex, vUv);
                    vec4 fg = texture2D(fgTex, vUv);

                    gl_FragColor = vec4(
                        mix(bg.rgb, fg.rgb, amount),
                        clamp(bg.a + fg.a, 0., 1.)
                    );
                }
            `,
              ].join("\n");

        this.prepare();
    }
}
