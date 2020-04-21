import { Node, NodeOptions } from "./Node";

export interface ShaderNodeOptions extends NodeOptions {}

export class ShaderNode extends Node {
    constructor(options: ShaderNodeOptions) {
        super(options);
    }
}
