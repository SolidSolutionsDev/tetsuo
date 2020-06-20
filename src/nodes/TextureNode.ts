import { Node, NodeOptions } from "./Node";
import { Loader } from "../core/Loader";

/**
 * Texture node initialization options
 *
 * @category Nodes
 */
export interface TextureNodeOptions extends NodeOptions {
    /**
     * URL of the texture
     */
    url: string;
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

    constructor(id: string, options: TextureNodeOptions) {
        super(id, options);

        this.setValue(options.url);
    }

    /**
     * Sets the texture
     *
     * @param value
     */
    setValue(url: string) {
        this.value = new Loader().loadTexture(url);

        this.output.setValue(this.value);

        return this;
    }
}
