import { Viewport } from "./Viewport";
import { Scene } from "./Scene";
import { PostShader } from "./PostShader";
import { ShadedObject } from "./ShadedObject";
import * as Utils from "./utils";

const TETSUO = {
    Scene,
    Viewport,
    PostShader,
    ShadedObject,
    Utils,
};

(window as any)["TETSUO"] = TETSUO;

export default TETSUO;
