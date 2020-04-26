import * as THREE from "three";

export class Loader {
    textureLoader: THREE.TextureLoader;

    constructor() {
        this.textureLoader = new THREE.TextureLoader();
    }

    loadTexture(url: string, onLoad?: (texture: THREE.Texture) => void) {
        return this.textureLoader.load(url, onLoad);
    }
}

export default new Loader();
