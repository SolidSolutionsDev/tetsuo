varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D tDiffuse;
uniform vec3 color;

#if NUM_DIR_LIGHTS > 0
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
    };

    uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
#endif

void main() {
    vec3 light = vec3(0., 0., 0.);

    #if NUM_DIR_LIGHTS > 0
        for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
            light += dot(directionalLights[i].direction, vNormal);
        }
    #endif

    gl_FragColor = vec4(light, 1.);
}