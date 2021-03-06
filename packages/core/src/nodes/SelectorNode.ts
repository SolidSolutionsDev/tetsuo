import { Callback } from "../types/Callback";
import { uniqueID } from "../utils/general";
import { Node, NodeOptions } from "./Node";

/**
 * Selector node initialization options
 *
 * @category Nodes
 */
export interface SelectorNodeOptions extends NodeOptions {
    /**
     * Node id to be initially enabled
     */
    enabledNode?: string;
}

/**
 * Receives many nodes as input, and outputs one of them, like a switchboard.
 *
 * @category Nodes
 */
export class SelectorNode extends Node {
    /**
     * Currently enabled node
     */
    enabledNode?: string;

    /**
     * Callbacks for when the selected node changes
     */
    private _onSet: Callback[] = [];

    constructor(options?: SelectorNodeOptions) {
        super({ ...options, id: options?.id || uniqueID("SelectorNode_") });

        this.enabledNode = options?.enabledNode;
    }

    /**
     * Connect a node to this node
     *
     * @param node
     * @param inputName
     */
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
     * Change the currently enabled node
     *
     * @param id
     */
    set(id: string) {
        let previousNode = this.enabledNode;

        this.enabledNode = id;

        let node: Node | undefined;
        for (let key in this.inputs) {
            if (id === key) {
                node = this.inputs[key].from;

                // enable new node
                this.inputs[key].from.enabled = true;

                // set it as output of selector
                setTimeout(
                    () => this.output.setValue(this.inputs[key].value),
                    0
                );
            }
            // disable other nodes
            else {
                this.inputs[key].from.enabled = false;
            }
        }

        // after enabling the new node and disabling the rest, we need to enable the node's input nodes
        // this is because these input nodes can also be children of the selector and been disabled in the previous step
        if (node) {
            Object.values(node.inputs).forEach((n) => (n.from.enabled = true));
        }

        // trigger the callbacks
        this._onSet.forEach((s) => s(previousNode, this.enabledNode));

        return this;
    }

    /**
     * Add a new callback to be called when a node is selected
     */
    onSet(callback: Callback): SelectorNode {
        this._onSet.push(callback);

        return this;
    }
}
