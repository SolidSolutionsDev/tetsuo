import { Node, NodeOptions } from "./Node";

export interface SelectorNodeOptions extends NodeOptions {
    /**
     * Node id to be initially enabled
     */
    enabledNode?: string;
}

export class SelectorNode extends Node {
    enabledNode: string;

    constructor(options?: SelectorNodeOptions) {
        super("selector", options);

        this.enabledNode = options?.enabledNode || "";
    }

    addInput(node: Node, inputName?: string) {
        super.addInput(node, inputName);

        if (node.id !== this.enabledNode) node.enabled = false;

        return this;
    }

    set(id: string) {
        this.enabledNode = id;

        for (let key in this.inputs) {
            if (id === key) {
                this.output.setValue(this.inputs[key].value);
                this.inputs[key].from.enabled = true;
            } else {
                this.inputs[key].from.enabled = false;
            }
        }
    }
}
