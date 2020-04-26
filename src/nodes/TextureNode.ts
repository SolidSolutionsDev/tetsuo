import { Node, NodeOptions } from "./Node";
import Loader from "../Loader";

export interface TextureNodeOptions extends NodeOptions {
    /**
     * URL of the texture
     */
    url: string;
}

/**
 * Node for texture
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
        this.value = Loader.loadTexture(url);

        this.output.setValue(this.value);

        return this;
    }
}
