import { Connection } from "./Connection";
import { NodeRenderer, NodeRendererOptions } from "./NodeRenderer";

export interface NodeOptions {
    id: string;
}

export class Node {
    id: string;

    inputs: { [key: string]: Connection } = {};

    output: Connection = new Connection(this);

    constructor({ id }: NodeOptions) {
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

    prepare() {}

    update(time: number) {}

    render() {}
}
