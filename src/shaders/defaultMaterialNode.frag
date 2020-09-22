varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D inputTex;
uniform vec3 color;

void main() {
    vec4 tex = texture2D(inputTex, vUv);

    gl_FragColor = vec4(tex.rgb, 1.);
}