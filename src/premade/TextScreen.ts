import * as THREE from "three";
import { Premade } from "./Premade";
import { NodeRenderer } from "../nodes/NodeRenderer";

export interface TestScreenOptions {}

export interface TestScreenUpdateOptions {}

export class TestScreen implements Premade {
    renderer: NodeRenderer;

    texture: THREE.Texture;

    constructor(options?: TestScreenOptions) {
        this.renderer = new NodeRenderer();
        this.texture = new THREE.Texture();
    }

    /**
     * Builds the screen
     */
    prepare() {
        return new Promise<any>((resolve, reject) => {});
    }

    /**
     * Updates the screen
     *
     * @param time - Current animation time
     * @param updateOptions - Update options to override defaults
     */
    update(time: number, updateOptions?: TestScreenUpdateOptions) {}

    /**
     * Retrieves the output texture for external use
     */
    getTexture() {
        return this.texture;
    }
}
