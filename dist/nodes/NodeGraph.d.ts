import { Node } from "./Node";
export declare class NodeGraph {
    /**
     * List of nodes in the graph
     */
    nodes: {
        [key: string]: Node;
    };
    /**
     * Root node
     */
    root: Node | null;
    /**
     * Adds a new node to the graph
     *
     * @param node
     */
    addNode(node: Node): this;
    /**
     * Sets a node as the root of the graph
     *
     * @param node
     */
    setRootNode(node: Node): this;
    /**
     * Traverses the graph (DFS) and calls a function per node
     *
     * @param fn - function to call for each node
     * @param node - node to start on
     * @param visited - list of visited nodes
     */
    traverse(fn: (node: Node) => void, node?: Node, visited?: string[]): void;
}
//# sourceMappingURL=NodeGraph.d.ts.map