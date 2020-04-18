import * as THREE from "three";

/**
 * List of default uniforms passed to PostShaders and ShadedObjects
 */
export const defaultUniforms: { [key: string]: { value: any } } = {
    tDiffuse: { value: null },
    iTime: { value: null },
    iResolution: { value: new THREE.Vector3() },
    mousePos: { value: new THREE.Vector2() },
};
