import { Connection } from "./Connection";
import { NodeRenderer, NodeRendererOptions } from "./NodeRenderer";

export interface NodeOptions {}

export class Node {
    id: string;

    inputs: { [key: string]: Connection } = {};

    output: Connection = new Connection(this);

    _onUpdate: ((time: number) => void) | null = null;

    constructor(id: string, options?: NodeOptions) {
        this.id = id;
    }

    connectTo(node: Node) {
        node.addInput(this.id, this.output);
        return this;
    }

    addInput(id: string, connection: Connection) {
        connection.addTo(this);
        this.inputs[id] = connection;
        this.prepare();
        return this;
    }

    onUpdate(fn: (time: number) => void) {
        this._onUpdate = fn;
    }

    prepare() {}

    update(time: number) {
        this._onUpdate && this._onUpdate(time);
    }

    render() {}

    resize() {}
}
