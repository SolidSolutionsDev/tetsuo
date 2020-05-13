export const compile = (...shaderChunks: string[]) => {
    return [...shaderChunks].join("\n");
};
