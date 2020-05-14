import { Node } from "../nodes/Node";
import { uniqueColor } from "../utils/utils";

export interface ProfilerNodeConfig {
    id: string;
    color: string;
    time: number;
}

export class Profiler {
    nodes: { [key: string]: ProfilerNodeConfig } = {};

    register(node: Node) {
        this.nodes[node.id] = {
            id: node.id,
            color: uniqueColor(),
            time: 0,
        };
    }

    update(node: Node, time: number) {
        if (!this.nodes[node.id]) return;
        this.nodes[node.id].time = time;
    }
}

export default new Profiler();
