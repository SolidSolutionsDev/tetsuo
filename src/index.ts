import { Viewport } from "./Viewport";
import { Scene } from "./Scene";
import { Clock } from "./Clock";
import { Shaders } from "./shaders";
import { PostShader } from "./PostShader";
import { ShadedObject } from "./ShadedObject";
import * as Utils from "./utils";

const TETSUO = {
    Scene,
    Viewport,
    Clock,
    Shaders,
    PostShader,
    ShadedObject,
    Utils,
};

(window as any)["TETSUO"] = TETSUO;

export default TETSUO;
