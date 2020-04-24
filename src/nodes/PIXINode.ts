import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";

export interface PIXINodeOptions extends NodeOptions {}

/**
 * pixi.js scene node
 */
export class PIXINode extends Node {
    /**
     * Renderer where this node will be included and rendered
     */
    nodeRenderer: NodeRenderer;

    constructor(id: string, nodeRenderer: NodeRenderer, options?: PIXINodeOptions) {
        super(id, options);

        this.nodeRenderer = nodeRenderer;
    }

    /**
     * Renders the node to an output connection
     */
    render() {
        return this;
    }

    /**
     * Handles renderer resize
     */
    resize() {
        return this;
    }
}
