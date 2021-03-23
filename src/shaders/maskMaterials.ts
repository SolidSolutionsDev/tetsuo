import { ShaderMaterial } from "./ShaderMaterial";

/**
 * Material to use if an object is not masked in a THREENode mask render
 *
 * @category Shaders
 */
export const UnmaskedMaterial = ShaderMaterial({
    fragmentShader: /*glsl*/ `
        void main() {
            gl_FragColor = vec4(1.);
        }
    `,
});

/**
 * Material to use if an object is masked in a THREENode mask render
 *
 * @category Shaders
 */
export const MaskedMaterial = ShaderMaterial({
    fragmentShader: /*glsl*/ `
        void main() {
            gl_FragColor = vec4(vec3(0.), 1.);
        }
    `,
});
