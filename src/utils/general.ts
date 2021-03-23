import { Node } from "../nodes/Node";
import { getNodeCache } from "./page";

let lastUniqueID = -1;

export const uniqueID = (prefix?: string) => {
    lastUniqueID++;
    return prefix ? prefix + lastUniqueID.toString() : lastUniqueID.toString();
};

export const addToNodeCache = (node: Node) => {
    getNodeCache()[node.id] = node;
};

export const getNodeByID = (id: string) => {
    return getNodeCache()[id];
};

export const getNodeIDs = () => {
    return getNodeCache().map((n: Node) => n.id);
};
