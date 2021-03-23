import * as THREE from "three";
import defaultUniforms from "./defaultUniforms";

const defaultVertexShader = require("../shaders/default.vert");
const defaultFragmentShader = require("../shaders/default.frag");

/**
 * ShaderMaterial initialization options
 *
 * @category Shaders
 */
export interface ShaderMaterialOptions {
    /**
     * Custom vertex shader for the material
     */
    vertexShader?: string;

    /**
     * Custom fragment shader for the material
     */
    fragmentShader?: string;

    /**
     * Whether the object is a THREE.Points (particles) instance
     */
    points?: boolean;

    /**
     * Which blending equation to use to blend this material
     */
    blending?: THREE.Blending;

    /**
     * Whether this material is transparent
     */
    transparent?: boolean;

    /**
     * Whether to have depth test enabled when rendering this material
     */
    depthTest?: boolean;

    /**
     * Custom uniforms for this material
     */
    uniforms?: { [key: string]: { value: any; gui?: boolean } };

    /**
     * Which side of faces will be rendered
     */
    side?: THREE.Side;
}

/**
 * Shader material initializer.
 * Provides default options and uniforms for custom shader material creation
 *
 * @param shaderOptions
 *
 * @category Shaders
 */
export const ShaderMaterial = (shaderOptions?: ShaderMaterialOptions) => {
    let mergedUniforms = THREE.UniformsUtils.merge([
        // three js scene uniforms
        THREE.UniformsLib["common"],
        THREE.UniformsLib["fog"],
        THREE.UniformsLib["lights"],

        defaultUniforms,
        shaderOptions?.uniforms,
    ]);

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: shaderOptions?.vertexShader || defaultVertexShader,
        fragmentShader: shaderOptions?.fragmentShader || defaultFragmentShader,
        uniforms: mergedUniforms,
        transparent:
            shaderOptions?.transparent !== undefined
                ? shaderOptions.transparent
                : true,
        blending: shaderOptions?.blending || THREE.NormalBlending,
        depthTest:
            shaderOptions?.depthTest !== undefined
                ? shaderOptions.depthTest
                : true,
        lights: true,
        side: shaderOptions?.side || THREE.FrontSide,
    });

    return shaderMaterial;
};
