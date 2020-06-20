import * as THREE from "three";
import { Callback } from "../types/Callback";
import { Howl } from "howler";

/**
 * Wrapper for all the relevant resource loaders
 *
 * @category Core
 */
export class Loader {
    /**
     * three.js texture loader
     */
    private _textureLoader: THREE.TextureLoader;

    /**
     * three.js geometry JSON loader
     */
    private _geometryLoader: THREE.BufferGeometryLoader;

    /**
     * three.js object JSON loader
     */
    private _objectLoader: THREE.ObjectLoader;

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
    loadTexture(url: string, onLoad?: Callback) {
        return this._textureLoader.load(url, onLoad);
    }

    /**
     * Load a three.js object located at a given url
     *
     * @param url
     * @param onLoad
     */
    loadObject(url: string, onLoad?: Callback) {
        return this._objectLoader.load(url, onLoad);
    }

    /**
     * Loads a geometry from a JSON located at a given url
     *
     * @param url
     * @param onLoad
     */
    loadGeometry(url: string, onLoad: Callback) {
        return this._geometryLoader.load(url, onLoad);
    }

    /**
     * Load an audio file located at a given url into a Howler instance
     *
     * @param url
     * @param onLoad
     */
    loadAudio(url: string, onLoad?: Callback) {
        let howl = new Howl({
            src: [url],
        });

        howl.on("load", () => onLoad && onLoad(howl));
    }
}
