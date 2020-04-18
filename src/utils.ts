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
