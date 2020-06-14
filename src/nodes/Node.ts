import { Connection } from "./Connection";
import { Callback } from "../types/Callback";

export interface NodeOptions {
    /**
     * Callback when the renderer initializes this node
     */
    onPrepare?: Callback;

    /**
     * Callback when the renderer updates this node
     */
    onUpdate?: Callback;

    /**
     * Callback when the renderer renders this node
     */
    onRender?: Callback;
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
     * Whether this node is enabled to be traversed for rendering
     * If false the node graph will ignore it and its children
     */
    enabled: boolean = true;

    /**
     * Callback when the renderer updates this node
     */
    protected _onUpdate: Callback[];

    /**
     * Callback when the renderer initializes this node
     */
    protected _onPrepare: Callback[];

    /**
     * Callback when the renderer renders this node
     */
    protected _onRender: Callback[];

    constructor(id: string, options?: NodeOptions) {
        this.id = id;

        this._onPrepare = options?.onPrepare ? [options.onPrepare] : [];
        this._onUpdate = options?.onUpdate ? [options?.onUpdate] : [];
        this._onRender = options?.onRender ? [options?.onRender] : [];
    }

    /**
     * Connect this node to another
     *
     * @param node
     */
    connectTo(node: Node, inputName?: string) {
        node.addInput(this, inputName);
        return this;
    }

    /**
     * Connect another node to this one
     *
     * @param node
     */
    addInput(node: Node, inputName?: string) {
        node.output.addTo(this);
        this.inputs[inputName || node.id] = node.output;

        // reinitialize the node
        this.prepare();

        return this;
    }

    /**
     * Sets a callback when the renderer prepares this node
     *
     * @param fn
     */
    onPrepare(fn: Callback) {
        this._onPrepare.push(fn);
        return this;
    }

    /**
     * Sets a callback when the renderer updates this node
     *
     * @param fn
     */
    onUpdate(fn: Callback) {
        this._onUpdate.push(fn);
        return this;
    }

    /**
     * Sets a callback when the renderer updates this node
     *
     * @param fn
     */
    onRender(fn: Callback) {
        this._onRender.push(fn);
        return this;
    }

    /**
     * Initializes the node for rendering
     */
    prepare() {
        this._onPrepare && this._onPrepare.forEach((fn) => fn());
        return this;
    }

    /**
     * Updates the node's relevant attributes for rendering
     *
     * @param time
     */
    update(totalTime: number, deltaTime: number) {
        this._onUpdate &&
            this._onUpdate.forEach((fn) => fn(totalTime, deltaTime));
        return this;
    }

    /**
     * Renders the node
     */
    render() {
        this._onRender && this._onRender.forEach((fn) => fn());
        return this;
    }

    /**
     * Handles renderer resize
     */
    resize() {
        return this;
    }
}
