varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D inputTex;
uniform vec3 color;

void main() {
    gl_FragColor = texture2D(inputTex, vUv);
}