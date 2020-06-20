import { Node } from "./Node";

/**
 * Represents a connection between nodes
 *
 * @category Nodes
 */
export class Connection {
    /**
     * Node where the value comes from
     */
    from: Node;

    /**
     * Nodes where the value goes to
     */
    to: { [key: string]: Node } = {};

    /**
     * Current connection value
     */
    value: any = null;

    constructor(fromNode: Node) {
        this.from = fromNode;
    }

    /**
     * Change output node
     *
     * @param node
     */
    setFrom(node: Node) {
        this.from = node;
        return this;
    }

    /**
     * Add new input node
     *
     * @param node
     */
    addTo(node: Node) {
        this.to[node.id] = node;
        return this;
    }

    /**
     * Set the connection value
     *
     * @param value
     */
    setValue(value: any) {
        this.value = value;
        return this;
    }

    /**
     * Get the connection value
     */
    getValue() {
        return this.value;
    }
}
