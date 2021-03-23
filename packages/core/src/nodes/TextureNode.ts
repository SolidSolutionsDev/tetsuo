import { Node, NodeOptions } from "./Node";
import { Loader } from "../core/Loader";
import { uniqueID } from "../utils/general";

/**
 * Texture node initialization options
 *
 * @category Nodes
 */
export interface TextureNodeOptions extends NodeOptions {
    /**
     * URL of the texture
     */
    url?: string;
}

/**
 * THREE.js texture node for use with {@link ShaderNode} and {@link THREENode}
 *
 * @category Nodes
 */
export class TextureNode extends Node {
    /**
     * Current texture
     */
    value: THREE.Texture | null = null;

    constructor(options?: TextureNodeOptions) {
        super({ ...options, id: options?.id || uniqueID("TextureNode_") });

        if (options?.url) this.loadTexture(options.url);
    }

    /**
     * Loads the texture
     *
     * @param url
     */
    loadTexture(url: string) {
        this.value = new Loader().loadTexture(url);

        this.output.setValue(this.value);

        return this;
    }

    /**
     * Sets the value
     *
     * @param texture
     */
    setValue(texture: THREE.Texture) {
        this.output.setValue(texture);
    }
}
