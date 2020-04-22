import { Connection } from "./Connection";
export interface NodeOptions {
}
export declare class Node {
    /**
     * Node ID
     */
    id: string;
    /**
     * List of nodes that connect to this node
     */
    inputs: {
        [key: string]: Connection;
    };
    /**
     * Output connection from this node to other nodes
     */
    output: Connection;
    /**
     * Callback when the renderer updates this node
     */
    _onUpdate: ((time: number) => void) | null;
    constructor(id: string, options?: NodeOptions);
    /**
     * Connect this node to another
     *
     * @param node
     */
    connectTo(node: Node): this;
    /**
     * Connect another node to this one
     *
     * @param node
     */
    addInput(node: Node): this;
    /**
     * Sets a callback when the renderer updates this node
     *
     * @param fn
     */
    onUpdate(fn: (time: number) => void): this;
    /**
     * Initializes the node for rendering
     */
    prepare(): this;
    /**
     * Updates the node's relevant attributes for rendering
     *
     * @param time
     */
    update(time: number): this;
    /**
     * Renders the node
     */
    render(): this;
    /**
     * Handles renderer resize
     */
    resize(): this;
}
//# sourceMappingURL=Node.d.ts.map