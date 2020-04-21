import dat from "dat.gui";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

/**
 * Listener for document ready state. http://youmightnotneedjquery.com/#ready
 *
 * @param {function} fn - callback when document is ready
 */
export function ready(fn: () => void): void {
    if (document.readyState != "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

/**
 * Adds a shader uniform value to a dat.gui instance
 *
 * @param {*} gui - dat.gui instance
 * @param {*} shader - ShaderPass/Material instance
 * @param {*} uniformName - Uniform name
 * @param {*} alias - Uniform alias to be presented in dat.gui
 * @param {*} onChange - Callback when uniform value changes
 * @param  {...any} extraArgs - Extra arguments to be passed to dat.gui
 */
export function datUniform(
    gui: dat.GUI,
    shader: any,
    uniformName: string,
    alias?: string,
    onChange?: (value?: any) => void,
    ...extraArgs: any[]
): any {
    return (
        gui
            // add shader to dat.gui
            .add(shader.uniforms[uniformName], "value", ...extraArgs)
            // set alias
            .name(alias || uniformName)
            // set up value change callback
            .onChange((value) => {
                shader.uniforms[uniformName].value = value;
                onChange && onChange(value);
            })
    );
}

/**
 * Random function
 * taken from ninjadev's nin
 */
export function Random(seed: number) {
    var m_w = seed || 123456791;
    var m_z = 987654321;
    var mask = 0xffffffff;

    return function random() {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        var result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;
        return result + 0.5;
    };
}

/**
 * Interpolation functions
 * taken from ninjadev's nin
 */
export function lerp(a: number, b: number, t: number) {
    t = clamp(0, t, 1);
    return b * t + a * (1 - t);
}

export function clamp(a: number, v: number, b: number) {
    return Math.min(b, Math.max(v, a));
}

export function smoothstep(a: number, b: number, t: number) {
    t = clamp(0, t, 1);
    var v = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    return b * v + a * (1 - v);
}

export function easeIn(a: number, b: number, t: number) {
    return lerp(a, b, t * t * t);
}

export function easeOut(a: number, b: number, t: number) {
    t = --t * t * t + 1;
    return lerp(a, b, t);
}

export function elasticOut(b: number, c: number, d: number, t: number) {
    t = clamp(0, t, 1);
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t);
}
