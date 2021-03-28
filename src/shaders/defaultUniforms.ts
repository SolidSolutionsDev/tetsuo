import * as THREE from "three";

/**
 * List of default uniforms
 */
const defaultUniforms: { [key: string]: { value: any } } = {
    time: { value: null },
    resolution: { value: new THREE.Vector3() },
    mousePos: { value: new THREE.Vector2() },
};

export default defaultUniforms;
