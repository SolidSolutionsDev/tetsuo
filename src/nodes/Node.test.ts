import { Node } from "./Node";

describe("Node", () => {
    let node: Node;

    beforeAll(() => {
        node = new Node({ id: "node" });
    });

    test("can instantiate", () => {
        expect(node).toBeTruthy();
    });

    test("creates output connection", () => {
        expect(node.output).toBeTruthy();
    });

    test("can connect to other node", () => {
        let nodeB = new Node({ id: "nodeB" });
        node.connectTo(nodeB);
        expect(nodeB.inputs["node"]).toBe(node.output);
    });
});
