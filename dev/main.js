TETSUO.PageUtils.prepareViewport({
    width: 800,
    height: 480,
    border: true,
    borderColor: "gray",
});

let scene = new TETSUO.Scene({ dev: true, autoStart: true });

let frag = TETSUO.Shaders.compile(
    TETSUO.Shaders.math,
    TETSUO.Shaders.sdf,
    TETSUO.Shaders.move,
    TETSUO.Shaders.light,

    /* glsl */ `
        varying vec2 vUv;
        uniform float iTime;
        uniform sampler2D tDiffuse;
        uniform vec3 iResolution;
        uniform vec2 mousePos;

        float map (vec3 point) {
            vec3 center = vec3(0., 0., 0.);
            return sdSphere(point, center, 0.2);
        }

              
        vec3 mainColor (vec3 point, vec3 normal, float totalDistance) {
            return vec3(1.);
        }

        vec3 background (vec3 rayOrigin, vec3 rayDirection) {
            return vec3(.0);
        }
    `,

    TETSUO.Shaders.raymarch,

    /* glsl */ `
        const int MAX_STEPS = 32;
        const float PRECISION = 0.1;

        vec3 castRay (vec3 rayOrigin, vec3 rayDirection) {
            float stepSize, totalDistance = 1.;
            vec4 previousPassColor = texture2D(tDiffuse, vUv);

            for (int i = 0; i < MAX_STEPS; i++) {
                stepSize = map(rayOrigin + rayDirection * totalDistance);
                totalDistance += stepSize;

                if (stepSize < PRECISION) {
                    vec3 intersectionPoint = rayOrigin + rayDirection * totalDistance;
                    vec3 intersectionPointNormal = estimateNormal(intersectionPoint);

                    return mainColor(
                        intersectionPoint,
                        intersectionPointNormal,
                        totalDistance
                    );
                };
            }

            return background(rayOrigin, rayDirection);
        }

        void main() {
            vec3 rayOrigin = vec3(0., 0., 1.);
            vec2 q = (vUv.xy * iResolution.xy - .5 * iResolution.xy) / iResolution.y;
            vec3 rayDirection = normalize(vec3(q, 0.) - rayOrigin);
            gl_FragColor = vec4(castRay(rayOrigin, rayDirection), 1.0);
        }
    `
);

let shaderNode = new TETSUO.ShaderNode("shaderNode", {
    fragmentShader: frag,
})
    .addInput(new TETSUO.UniformNode("rotXAmount", { value: 1 }))
    .addInput(new TETSUO.UniformNode("rotYAmount", { value: 1 }))
    .addInput(new TETSUO.UniformNode("rotZAmount", { value: 1 }))
    .addInput(new TETSUO.UniformNode("sphereSize", { value: 1 }))
    .addInput(new TETSUO.UniformNode("cubeSize", { value: 1 }))
    .addInput(new TETSUO.UniformNode("normalAmount", { value: 0.5 }))
    .addInput(new TETSUO.UniformNode("diffuse1Amount", { value: 0.3 }))
    .addInput(new TETSUO.UniformNode("diffuse2Amount", { value: 0.2 }));

scene.connectToScreen(shaderNode);
