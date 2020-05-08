import { Node } from "../nodes/Node";

let uniqueColors: string[] = [];

let uniqueColor = () => {
    let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);

    while (uniqueColors.includes(color)) {
        color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    }

    uniqueColors.push(color);

    return color;
};

export interface ProfilerNodeConfig {
    id: string;
    color: string;
    time: number;
}

class Profiler {
    nodes: { [key: string]: ProfilerNodeConfig } = {};

    constructor() {
        setInterval(() => console.log(this.nodes), 1000);
    }

    register(node: Node) {
        this.nodes[node.id] = {
            id: node.id,
            color: uniqueColor(),
            time: 0,
        };
    }

    update(node: Node, time: number) {
        this.nodes[node.id].time = time;
    }
}

export default new Profiler();
