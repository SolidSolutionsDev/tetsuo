import { Viewport } from "./core/Viewport";
import { Bootstrap } from "./core/Bootstrap";
import { Clock } from "./core/Clock";
import { Shaders } from "./shaders";
import { ShadedObject } from "./shaders/ShadedObject";
import { NodeRenderer } from "./nodes/NodeRenderer";
import { NodeGraph } from "./nodes/NodeGraph";
import { Node } from "./nodes/Node";
import { ShaderNode } from "./nodes/ShaderNode";
import { MaterialNode } from "./nodes/MaterialNode";
import { THREENode } from "./nodes/THREENode";
import { PIXINode } from "./nodes/PIXINode";
import { UniformNode } from "./nodes/UniformNode";
import { TextureNode } from "./nodes/TextureNode";
import { MeshNode } from "./nodes/MeshNode";
import { Connection } from "./nodes/Connection";
import { Loader } from "./core/Loader";
import { Profiler } from "./debug/Profiler";
import { AnaglyphNode } from "./nodes/effects/AnaglyphNode";
import { BloomNode } from "./nodes/effects/BloomNode";
import { FXAANode } from "./nodes/effects/FXAANode";
import { GrainNode } from "./nodes/effects/GrainNode";
import { DisplaceGlitchNode } from "./nodes/effects/DisplaceGlitchNode";
import { FogNode } from "./nodes/effects/FogNode";
import { BoxBlurNode } from "./nodes/effects/BoxBlurNode";
import { DOFNode } from "./nodes/effects/DOFNode";
import { ShaderMaterial } from "./shaders/ShaderMaterial";
import { OverlayNode } from "./nodes/effects/OverlayNode";
import { SelectorNode } from "./nodes/SelectorNode";
import { CrossfadeNode } from "./nodes/CrossfadeNode";
import { GroupNode } from "./nodes/GroupNode";
import { Preloader } from "./core/Preloader";
import { Syncer } from "./utils/Syncer";
import { MaskedMaterial, UnmaskedMaterial } from "./shaders/maskMaterials";
import Logger from "./utils/Logger";
import * as GeneralUtils from "./utils/general";
import * as ColorUtils from "./utils/color";
import * as PageUtils from "./utils/page";
import * as NumberUtils from "./utils/number";

const TETSUO = {
    //
    // core
    Bootstrap,
    Viewport,
    Clock,
    Preloader,
    Loader,
    Syncer,
    //
    // node structure classes
    NodeRenderer,
    NodeGraph,
    Node,
    Connection,
    //
    // base nodes
    ShaderNode,
    THREENode,
    PIXINode,
    UniformNode,
    TextureNode,
    MeshNode,
    MaterialNode,
    GroupNode,
    SelectorNode,
    CrossfadeNode,
    //
    // effect nodes
    AnaglyphNode,
    BloomNode,
    DisplaceGlitchNode,
    FogNode,
    BoxBlurNode,
    DOFNode,
    OverlayNode,
    FXAANode,
    GrainNode,
    //
    // shader lib
    Shaders,
    ShadedObject,
    ShaderMaterial,
    MaskedMaterial,
    UnmaskedMaterial,
    //
    // debug
    Profiler,
    Logger,
    //
    // utils
    Utils: {
        ...ColorUtils,
        ...PageUtils,
        ...NumberUtils,
        ...GeneralUtils,
    },
};

export default TETSUO;

(window as any)["TETSUO"] = TETSUO;
