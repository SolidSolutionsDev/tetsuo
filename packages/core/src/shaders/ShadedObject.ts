import * as THREE from "three";
import defaultUniforms from "./defaultUniforms";

const defaultVertexShader = require("../shaders/default.vert");
const defaultFragmentShader = require("../shaders/default.frag");

/**
 * ShadedObject initialization options
 *
 * @category Shaders
 */
export interface ShadedObjectOptions {
    geometry: THREE.Geometry;
    vertexShader?: string;
    fragmentShader?: string;
    points?: boolean;
    blending?: THREE.Blending;
    transparent?: boolean;
    depthTest?: boolean;
    uniforms?: { [key: string]: { value: any; gui?: boolean } };
    side?: THREE.Side;
}

/**
 * Mesh with shaders initializer.
 * Provides default options and uniforms for custom object creation
 *
 * @param shaderOptions
 *
 * @category Shaders
 */
export const ShadedObject = (options: ShadedObjectOptions) => {
    let mergedUniforms = THREE.UniformsUtils.merge([
        // three js scene uniforms
        THREE.UniformsLib["common"],
        THREE.UniformsLib["fog"],
        THREE.UniformsLib["lights"],

        defaultUniforms,
        options.uniforms,
    ]);

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: options.vertexShader || defaultVertexShader,
        fragmentShader: options.fragmentShader || defaultFragmentShader,
        uniforms: mergedUniforms,
        transparent:
            options.transparent !== undefined ? options.transparent : true,
        blending: options.blending || THREE.NormalBlending,
        depthTest: options.depthTest !== undefined ? options.depthTest : true,
        lights: true,
        side: options.side || THREE.FrontSide,
    });

    return options.points
        ? new THREE.Points(options.geometry, shaderMaterial)
        : new THREE.Mesh(options.geometry, shaderMaterial);
};
