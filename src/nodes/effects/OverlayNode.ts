import { ShaderNode, ShaderNodeOptions } from "../ShaderNode";
import { Shaders } from "../../shaders";
import { uniqueID } from "../../utils/general";

/**
 * Overlay node initialization options
 *
 * @category Nodes
 */
export interface OverlayNodeOptions extends ShaderNodeOptions {}

/**
 * Overlays two inputs using alpha
 *
 * @category Nodes
 */
export class OverlayNode extends ShaderNode {
    constructor(options?: OverlayNodeOptions) {
        super(
            { ...options, id: options?.id || uniqueID("OverlayNode_") },
            false
        );

        this.fragmentShader = [
            Shaders.filters,
            /* glsl */ `
                varying vec2 vUv;

                uniform sampler2D bgTex; 
                uniform sampler2D fgTex;

                void main() {
                    vec4 bg = texture2D(bgTex, vUv);
                    vec4 fg = texture2D(fgTex, vUv);

                    gl_FragColor = vec4(
                        mix(bg.rgb, fg.rgb, fg.a),
                        clamp(bg.a + fg.a, 0., 1.)
                    );
                }
            `,
        ].join("\n");

        this.prepare();
    }
}
