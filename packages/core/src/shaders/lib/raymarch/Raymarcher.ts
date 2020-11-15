import { RaymarchLib } from ".";
import { Shaders } from "../..";
import { compile } from "../../compile";

export interface RaymarcherOptions {
    consts: string;
}

export class Raymarcher {
    code: string;
    consts?: string;

    constructor(code: string, options: RaymarcherOptions) {
        this.code = code;
        this.consts = options?.consts;
    }

    toString() {
        return compile(
            Shaders.math,
            Shaders.hash,
            Shaders.simplex,

            this.consts || RaymarchLib.consts,
            RaymarchLib.uniforms,
            RaymarchLib.structs,
            RaymarchLib.sdf,

            RaymarchLib.camera,

            this.code,

            RaymarchLib.ray,
            RaymarchLib.main
        );
    }

    toShadertoy() {
        return compile(
            Shaders.hash,
            Shaders.simplex,

            this.consts || RaymarchLib.consts,
            RaymarchLib.structs,
            RaymarchLib.sdf,

            RaymarchLib.camera,

            this.code,

            RaymarchLib.ray,
            RaymarchLib.shadertoyMain
        );
    }
}
