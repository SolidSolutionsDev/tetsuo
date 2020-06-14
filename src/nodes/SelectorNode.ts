import { Node, NodeOptions } from "./Node";

export interface SelectorNodeOptions extends NodeOptions {
    /**
     * Node id to be initially enabled
     */
    enabledNode?: string;
}

export class SelectorNode extends Node {
    /**
     * Currently enabled node
     */
    enabledNode?: string;

    constructor(options?: SelectorNodeOptions) {
        super("selector", options);

        this.enabledNode = options?.enabledNode;
    }

    addInput(node: Node, inputName?: string) {
        super.addInput(node, inputName);

        // if this is the first node being connected to the selector
        // set it as the enabled node
        if (!this.enabledNode) this.enabledNode = node.id;
        // otherwise if there's already a selected node, disable the new node
        else if (node.id !== this.enabledNode) node.enabled = false;

        // this solves a bug where the first connected node wouldnt render
        // not sure why it solves the bug...?
        setTimeout(() => {
            this.output.setValue(this.inputs[this.enabledNode as string].value);
        }, 0);

        return this;
    }

    /**
     * Change the currently selected node
     *
     * @param id
     */
    set(id: string) {
        this.enabledNode = id;

        for (let key in this.inputs) {
            if (id === key) {
                this.inputs[key].from.enabled = true;
                setTimeout(
                    () => this.output.setValue(this.inputs[key].value),
                    0
                );
            } else {
                this.inputs[key].from.enabled = false;
            }
        }

        return this;
    }
}
