import { NodeGraph } from "./NodeGraph";
import { Node } from "./Node";

describe("Node graph", () => {
    let graph: NodeGraph;
    let root: Node, nodeA: Node, nodeB: Node, nodeC: Node;

    beforeAll(() => {
        graph = new NodeGraph();

        root = graph.createRootNode();

        nodeA = graph.createNode("nodeA");
        nodeA.connectTo(root);

        nodeB = graph.createNode("nodeB");
        nodeB.connectTo(root);

        nodeC = graph.createNode("nodeC");

        nodeC.connectTo(nodeA);
        nodeC.connectTo(nodeB);
    });

    test("can instantiate", () => {
        expect(graph).toBeTruthy();
    });

    test("should traverse correctly", () => {
        let visited: string[] = [];

        graph.traverse((node) => visited.push(node.id));

        expect(visited).toEqual(["nodeC", "nodeA", "nodeB", "root"]);
    });

    test("should traverse from node correctly", () => {
        let visited: string[] = [];

        graph.traverse((node) => visited.push(node.id), nodeA);

        expect(visited).toEqual(["nodeC", "nodeA"]);
    });
});
