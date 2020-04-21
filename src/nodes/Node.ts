import { Connection } from "./Connection";

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
        return this;
    }

    prepare: () => void = () => {};

    update: (time: number) => void = () => {};

    render: (renderer: THREE.WebGLRenderer) => void = () => {};
}
