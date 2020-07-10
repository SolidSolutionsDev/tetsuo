import defaultUniforms from "./defaultUniforms";
import { compile } from "./compile";
import { RaymarchLib } from "./lib/raymarch";

/**
 * Shader code library and utilities
 *
 * @category Shaders
 */
export const Shaders = {
    /**
     * Default fragment shader code used in {@link ShaderMaterial} and {@link ShadedObject}
     */
    defaultFrag: require("./default.frag") as string,

    /**
     * Default fragment shader code used in {@link ShaderNode}
     */
    defaultPostFrag: require("./defaultPost.frag") as string,

    /**
     * Default vertex shader code used in {@link ShadedObject}
     */
    defaultVert: require("./default.vert") as string,

    /**
     * Depth related GLSL code
     */
    depth: require("./lib/depth.glsl") as string,

    /**
     * Lighting related GLSL code
     */
    light: require("./lib/light.glsl") as string,

    /**
     * Math related GLSL code
     */
    math: require("./lib/math.glsl") as string,

    /**
     * GLSL hash functions
     */
    hash: require("./lib/hash.glsl") as string,

    /**
     * GLSL perlin-noise functions
     */
    perlin: require("./lib/perlin.glsl") as string,

    /**
     * GLSL simplex-noise functions
     */
    simplex: require("./lib/simplex.glsl") as string,

    /**
     * 3D translation related GLSL code
     */
    move: require("./lib/move.glsl") as string,

    /**
     * GLSL worley-noise functions
     */
    worley: require("./lib/worley.glsl") as string,

    /**
     * Image filtering related GLSL code
     */
    filters: require("./lib/filters.glsl") as string,

    RaymarchLib,

    /**
     * List of default uniforms passed to {@link ShaderMaterial}, {@link ShadedObject}, {@link ShaderNode}
     */
    defaultUniforms,

    /**
     * Compiles several shader chunks into a single shader piece of code
     */
    compile,
};
