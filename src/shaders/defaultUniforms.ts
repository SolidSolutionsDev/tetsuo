import * as THREE from "three";

/**
 * List of default uniforms passed to PostShaders and ShadedObjects
 */
const defaultUniforms: { [key: string]: { value: any } } = {
    iTime: { value: null },
    iResolution: { value: new THREE.Vector3() },
    mousePos: { value: new THREE.Vector2() },
};

export default defaultUniforms;
