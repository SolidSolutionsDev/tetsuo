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
import { BloomNode } from "./nodes/effects/BloomNode";
import { DisplaceGlitchNode } from "./nodes/effects/DisplaceGlitchNode";
import { FogNode } from "./nodes/effects/FogNode";
import { BoxBlurNode } from "./nodes/effects/BoxBlurNode";
import { DOFNode } from "./nodes/effects/DOFNode";
import { ShaderMaterial } from "./utils/ShaderMaterial";
import { OverlayNode } from "./nodes/effects/OverlayNode";
import { SelectorNode } from "./nodes/SelectorNode";
import { Premade } from "./nodes/premade";

const TETSUO = {
    // core
    Scene,
    Viewport,
    Clock,
    Loader,
    Profiler,

    // utils
    Utils,
    ShadedObject,
    ShaderMaterial,

    // shader lib
    Shaders,

    // node structure classes
    NodeRenderer,
    NodeGraph,
    Node,
    Connection,

    // base nodes
    ShaderNode,
    THREENode,
    PIXINode,
    UniformNode,
    TextureNode,
    MeshNode,
    SelectorNode,

    // effect nodes
    AnaglyphNode,
    BloomNode,
    DisplaceGlitchNode,
    FogNode,
    BoxBlurNode,
    DOFNode,
    OverlayNode,

    // premades
    Premade,
};

(window as any)["TETSUO"] = TETSUO;

export default TETSUO;
