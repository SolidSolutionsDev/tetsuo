/**
 * Compiles several shader chunks into a single shader piece of code
 *
 * @param shaderChunks
 */
export const compile: (...shaderChunks: string[]) => string = (
    ...shaderChunks: string[]
) => {
    return [...shaderChunks].join("\n");
};
