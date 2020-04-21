import { Node, NodeOptions } from "./Node";

export class NodeGraph {
    nodes: { [key: string]: Node } = {};

    root: Node | null = null;

    addNode(node: Node) {
        this.nodes[node.id] = node;
        return this;
    }

    setRootNode(node: Node) {
        this.root = node;
        return this;
    }

    createNode(nodeOptions: NodeOptions) {
        let node = new Node(nodeOptions);
        this.addNode(node);
        return node;
    }

    createRootNode(nodeOptions: NodeOptions) {
        let node = this.createNode(nodeOptions);
        this.setRootNode(node);
        return node;
    }

    traverse(fn: (node: Node) => void, node?: Node, visited: string[] = []) {
        if (!node) {
            if (this.root) {
                node = this.root;
            } else return;
        }

        if (visited.includes(node.id)) return;
        visited.push(node.id);

        for (let key in node.inputs) {
            let input = node.inputs[key];
            input.from && this.traverse(fn, input.from, visited);
        }

        fn(node);
    }
}
