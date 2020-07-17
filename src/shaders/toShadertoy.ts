export const toShadertoy = (code: string) => {
    return code
        .replace(
            "void main() {",
            "void mainImage(out vec4 fragColor, in vec2 fragCoord) {\nvec2 uv = fragCoord/iResolution.xy;"
        )
        .replace("gl_FragColor", "fragColor")
        .replace("varying vec2 vUv;", "")
        .replace("uniform vec3 iResolution;", "")
        .replace("uniform float iTime;", "")
        .replace("getRay(cam, vUv)", "getRay(cam, uv)");
};
