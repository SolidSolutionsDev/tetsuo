import { Connection } from "./Connection";

export interface NodeOptions {
    /**
     * Callback when the renderer initializes this node
     */
    onPrepare?: (...args: any) => void;

    /**
     * Callback when the renderer updates this node
     */
    onUpdate?: (time: number, ...args: any) => void;
}

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
    protected _onUpdate: ((time: number, ...args: any) => void) | null = null;

    /**
     * Callback when the renderer initializes this node
     */
    protected _onPrepare: ((...args: any) => void) | null = null;

    constructor(id: string, options?: NodeOptions) {
        this.id = id;

        this._onPrepare = options?.onPrepare || null;
        this._onUpdate = options?.onUpdate || null;
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
     * Sets a callback when the renderer prepares this node
     *
     * @param fn
     */
    onPrepare(fn: () => void) {
        this._onPrepare = fn;
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
        this._onPrepare && this._onPrepare();
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
