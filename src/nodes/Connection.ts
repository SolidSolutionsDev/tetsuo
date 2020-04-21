import { Node } from "./Node";

export type ConnectionValue =
    | null
    | number
    | THREE.Vector2
    | THREE.Vector3
    | THREE.Vector4
    | THREE.Texture;

export class Connection {
    from: Node | null = null;
    to: { [key: string]: Node } = {};
    value: ConnectionValue = null;

    constructor(fromNode?: Node) {
        if (fromNode) {
            this.from = fromNode;
        }
    }

    setFrom(node: Node) {
        this.from = node;
        return this;
    }

    addTo(node: Node) {
        this.to[node.id] = node;
        return this;
    }

    setValue(value: ConnectionValue) {
        this.value = value;
        return this;
    }

    getValue() {
        return this.value;
    }
}
