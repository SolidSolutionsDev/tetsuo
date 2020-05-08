import { Viewport } from "./core/Viewport";
import { Scene } from "./core/Scene";
import { Clock } from "./core/Clock";
import { Shaders } from "./shaders";
import { ShadedObject } from "./utils/ShadedObject";
import { NodeRenderer } from "./nodes/NodeRenderer";
import { NodeGraph } from "./nodes/NodeGraph";
import { Node } from "./nodes/Node";
import { ShaderNode } from "./nodes/ShaderNode";
import { THREENode } from "./nodes/THREENode";
import { PIXINode } from "./nodes/PIXINode";
import { UniformNode } from "./nodes/UniformNode";
import { TextureNode } from "./nodes/TextureNode";
import { MeshNode } from "./nodes/MeshNode";
import { Connection } from "./nodes/Connection";
import * as Utils from "./utils/utils";
import Loader from "./core/Loader";
import Profiler from "./core/Profiler";
import { AnaglyphNode } from "./nodes/effects/AnaglyphNode";

const TETSUO = {
    Scene,
    Viewport,
    Clock,
    Shaders,
    ShadedObject,
    NodeRenderer,
    NodeGraph,
    Node,
    Connection,
    ShaderNode,
    THREENode,
    PIXINode,
    UniformNode,
    TextureNode,
    MeshNode,
    Utils,
    Loader,
    Profiler,
    AnaglyphNode,
};

(window as any)["TETSUO"] = TETSUO;

export default TETSUO;
