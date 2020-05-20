import * as THREE from "three";
import { Premade } from "./Premade";
import { NodeRenderer } from "../nodes/NodeRenderer";
import { PIXINode } from "../nodes/PIXINode";
import { ShaderNode } from "../nodes/ShaderNode";
import { ShaderMaterial } from "three";
import { Shaders } from "../shaders";

export interface TextScreenOptions {
    width: number;
    height: number;
    renderer?: NodeRenderer;
}

export interface TextScreenUpdateOptions {}

export class TextScreen implements Premade {
    renderer: NodeRenderer;

    texture: THREE.Texture;

    output: any;

    constructor(options: TextScreenOptions) {
        this.renderer = options.renderer || new NodeRenderer();

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
    update(time: number, updateOptions?: TextScreenUpdateOptions) {}

    /**
     * Retrieves the output texture for external use
     */
    getTexture() {
        return this.texture;
    }
}
