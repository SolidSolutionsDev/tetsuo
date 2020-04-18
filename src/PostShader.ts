import { defaultUniforms } from "./uniforms";

const defaultVertexShader = require("./shaders/default.vert");
const defaultFragmentShader = require("./shaders/default.frag");

/**
 * Post processing shader initializer
 *
 * @param shaderOptions
 */
export const PostShader = (shaderOptions: {
    vertexShader?: string;
    fragmentShader?: string;
    uniforms?: { [key: string]: { value: any; gui?: boolean } };
}) => ({
    vertexShader: shaderOptions.vertexShader || defaultVertexShader,
    fragmentShader: shaderOptions.fragmentShader || defaultFragmentShader,
    uniforms: { ...defaultUniforms, ...shaderOptions.uniforms },
});
