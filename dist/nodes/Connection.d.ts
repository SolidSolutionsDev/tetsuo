import { Node } from "./Node";
/**
 * Represents a connection between nodes
 */
export declare class Connection {
    /**
     * Node where the value comes from
     */
    from: Node | null;
    /**
     * Nodes where the value goes to
     */
    to: {
        [key: string]: Node;
    };
    /**
     * Current connection value
     */
    value: any;
    constructor(fromNode?: Node);
    /**
     * Change output node
     *
     * @param node
     */
    setFrom(node: Node): this;
    /**
     * Add new input node
     *
     * @param node
     */
    addTo(node: Node): this;
    /**
     * Set the connection value
     *
     * @param value
     */
    setValue(value: any): this;
    /**
     * Get the connection value
     */
    getValue(): any;
}
//# sourceMappingURL=Connection.d.ts.map