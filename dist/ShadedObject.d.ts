import * as THREE from "three";
/**
 * Mesh with shaders initializer
 *
 * @param shaderOptions
 */
export declare const ShadedObject: (shaderOptions: {
    geometry: THREE.Geometry;
    vertexShader?: string | undefined;
    fragmentShader?: string | undefined;
    uniforms?: {
        [key: string]: {
            value: any;
            gui?: boolean | undefined;
        };
    } | undefined;
}) => THREE.Mesh;
//# sourceMappingURL=ShadedObject.d.ts.map