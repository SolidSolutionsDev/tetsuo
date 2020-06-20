import { Node } from "../nodes/Node";
import { ColorUtils } from "../utils/color";

/**
 * Configuration for a node registered in the profiler
 *
 * @category Debug
 */
export interface ProfilerNodeConfig {
    /**
     * Node id
     */
    id: string;

    /**
     * Node display color
     */
    color: string;

    /**
     * Last frame render time
     */
    time: number;
}

/**
 * Debug class for tracking node rendering times
 *
 * @category Debug
 */
export class Profiler {
    /**
     * List of nodes added to this profiler for tracking
     */
    private _nodes: { [key: string]: ProfilerNodeConfig } = {};

    /**
     * Register a new node to be tracked by the profiler
     *
     * @param node
     */
    register(node: Node) {
        this._nodes[node.id] = {
            id: node.id,
            color: ColorUtils.uniqueColor(),
            time: 0,
        };
    }

    /**
     * Update a node's time rendering the last frame
     *
     * @param node
     * @param time - Time of rendering
     */
    update(node: Node, time: number) {
        if (!this._nodes[node.id]) return;
        this._nodes[node.id].time = time;
    }
}
