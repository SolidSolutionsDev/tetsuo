import * as THREE from "three";

/**
 * Wrapper singleton for all the relevant resource loaders
 */
export class Loader {
    /**
     * three.js texture loader
     */
    protected _textureLoader: THREE.TextureLoader;

    /**
     * three.js geometry JSON loader
     */
    protected _geometryLoader: THREE.BufferGeometryLoader;

    protected _objectLoader: THREE.ObjectLoader;

    constructor() {
        this._textureLoader = new THREE.TextureLoader();
        this._geometryLoader = new THREE.BufferGeometryLoader();
        this._objectLoader = new THREE.ObjectLoader();
    }

    /**
     * Load a three.js texture located at a given url
     *
     * @param url
     * @param onLoad
     */
    loadTexture(url: string, onLoad?: (texture: THREE.Texture) => void) {
        return this._textureLoader.load(url, onLoad);
    }

    loadObject(url: string, onLoad?: (obj: any) => void) {
        return this._objectLoader.load(url, onLoad);
    }

    /**
     * Loads a geometry from a JSON located at a given url
     *
     * @param url
     * @param onLoad
     */
    loadGeometry(
        url: string,
        onLoad: (
            geometry: THREE.BufferGeometry | THREE.InstancedBufferGeometry
        ) => void
    ) {
        return this._geometryLoader.load(url, onLoad);
    }
}

export default new Loader();
