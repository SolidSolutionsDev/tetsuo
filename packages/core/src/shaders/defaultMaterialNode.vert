varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normalMatrix * normalize(normal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}