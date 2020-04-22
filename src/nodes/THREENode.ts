import { Node, NodeOptions } from "./Node";

interface THREENodeOptions extends NodeOptions {}

class THREENode extends Node {
    constructor(id: string, options: THREENodeOptions) {
        super(id, options);
    }
}
