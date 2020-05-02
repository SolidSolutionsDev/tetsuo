import { Connection } from "./Connection";

export interface NodeOptions {}

export class Node {
    /**
     * Node ID
     */
    id: string;

    /**
     * List of nodes that connect to this node
     */
    inputs: { [key: string]: Connection } = {};

    /**
     * Output connection from this node to other nodes
     */
    output: Connection = new Connection(this);

    /**
     * Callback when the renderer updates this node
     */
    protected _onUpdate: ((time: number) => void) | null = null;

    constructor(id: string, options?: NodeOptions) {
        this.id = id;
    }

    /**
     * Connect this node to another
     *
     * @param node
     */
    connectTo(node: Node) {
        node.addInput(this);
        return this;
    }

    /**
     * Connect another node to this one
     *
     * @param node
     */
    addInput(node: Node) {
        node.output.addTo(this);
        this.inputs[node.id] = node.output;

        // reinitialize the node
        this.prepare();

        return this;
    }

    /**
     * Sets a callback when the renderer updates this node
     *
     * @param fn
     */
    onUpdate(fn: (time: number) => void) {
        this._onUpdate = fn;
        return this;
    }

    /**
     * Initializes the node for rendering
     */
    prepare() {
        return this;
    }

    /**
     * Updates the node's relevant attributes for rendering
     *
     * @param time
     */
    update(time: number) {
        this._onUpdate && this._onUpdate(time);
        return this;
    }

    /**
     * Renders the node
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
