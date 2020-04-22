import { Viewport } from "./Viewport";
import { Scene } from "./Scene";
import { Clock } from "./Clock";
import { NodeRenderer } from "./nodes/NodeRenderer";
import { NodeGraph } from "./nodes/NodeGraph";
import { Node } from "./nodes/Node";
import { ShaderNode } from "./nodes/ShaderNode";
import { THREENode } from "./nodes/THREENode";
import { UniformNode } from "./nodes/UniformNode";
import { Connection } from "./nodes/Connection";
import * as Utils from "./utils";
declare const TETSUO: {
    Scene: typeof Scene;
    Viewport: typeof Viewport;
    Clock: typeof Clock;
    Shaders: {
        defaultFrag: any;
        defaultPostFrag: any;
        defaultVert: any;
        light: any;
        math: any;
        move: any;
        sdf: any;
        worley: any;
    };
    ShadedObject: (shaderOptions: {
        geometry: import("three").Geometry;
        vertexShader?: string | undefined;
        fragmentShader?: string | undefined;
        uniforms?: {
            [key: string]: {
                value: any;
                gui?: boolean | undefined;
            };
        } | undefined;
    }) => import("three").Mesh;
    NodeRenderer: typeof NodeRenderer;
    NodeGraph: typeof NodeGraph;
    Node: typeof Node;
    Connection: typeof Connection;
    ShaderNode: typeof ShaderNode;
    THREENode: typeof THREENode;
    UniformNode: typeof UniformNode;
    Utils: typeof Utils;
};
export default TETSUO;
//# sourceMappingURL=index.d.ts.map