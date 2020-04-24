import * as THREE from "three";
import { defaultUniforms } from "./uniforms";

const defaultVertexShader = require("./shaders/default.vert");
const defaultFragmentShader = require("./shaders/default.frag");

/**
 * Mesh with shaders initializer
 *
 * @param shaderOptions
 */
export const ShadedObject = (shaderOptions: {
    geometry: THREE.Geometry;
    vertexShader?: string;
    fragmentShader?: string;
    points?: boolean;
    uniforms?: { [key: string]: { value: any; gui?: boolean } };
}) => {
    let mergedUniforms = THREE.UniformsUtils.merge([
        // three js scene uniforms
        THREE.UniformsLib["common"],
        THREE.UniformsLib["fog"],
        THREE.UniformsLib["lights"],

        defaultUniforms,
        shaderOptions.uniforms,
    ]);

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: shaderOptions.vertexShader || defaultVertexShader,
        fragmentShader: shaderOptions.fragmentShader || defaultFragmentShader,
        uniforms: mergedUniforms,
        lights: true,
    });

    return shaderOptions.points
        ? new THREE.Points(shaderOptions.geometry, shaderMaterial)
        : new THREE.Mesh(shaderOptions.geometry, shaderMaterial);
};
