import { Shaders } from "../..";
import { compile } from "../../compile";

export interface RaymarcherOptions {
    code: string;
    consts?: string;
}

export const RaymarchLib = {
    consts: require("./consts.glsl"),
    uniforms: require("./uniforms.glsl"),
    structs: require("./structs.glsl"),
    sdf: require("./sdf.glsl"),
    ray: require("./ray.glsl"),
    camera: require("./camera.glsl"),
    main: require("./main.glsl"),
};

export const Raymarcher = ({ code, consts }: RaymarcherOptions) =>
    compile(
        Shaders.math,
        Shaders.hash,
        Shaders.simplex,

        consts || RaymarchLib.consts,
        RaymarchLib.uniforms,
        RaymarchLib.structs,
        RaymarchLib.sdf,

        RaymarchLib.camera,

        code,

        RaymarchLib.ray,
        RaymarchLib.main
    );
