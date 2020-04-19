// when page is ready
TETSUO.Utils.ready(() => {
    // initialize the scene
    const scene = new TETSUO.Scene({
        viewportElement: document.getElementById("viewport"),
        dev: true,
    });

    // add a post processing shader
    let shader = scene.addPostShader(
        TETSUO.PostShader({
            fragmentShader: fragmentShader,

            // add uniforms to be tracked by dat.gui
            uniforms: {
                rotXAmount: { value: 1, gui: true },
                rotYAmount: { value: 1, gui: true },
                rotZAmount: { value: 1, gui: true },
                sphereSize: { value: 1, gui: true },
                cubeSize: { value: 1, gui: true },
                normalAmount: { value: 0.5, gui: true },
                diffuse1Amount: { value: 0.3, gui: true },
                diffuse2Amount: { value: 0.2, gui: true },
            },
        })
    );

    // initialize post processing chain
    scene.initPostProcessing();

    // start rendering
    scene.animate((time) => {
        // alter uniforms values
        shader.uniforms["cubeSize"].value = Math.abs(Math.sin(time));
        shader.uniforms["sphereSize"].value = Math.abs(Math.cos(time));
    });
});

const fragmentShader = [
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
        uniform float rotXAmount;
        uniform float rotYAmount;
        uniform float rotZAmount;
        uniform float sphereSize;
        uniform float cubeSize;
        uniform float normalAmount;
        uniform float diffuse1Amount;
        uniform float diffuse2Amount;

        const int MAX_STEPS = 32;
        const float PRECISION = 0.1;
        const float MAX_DISTANCE = 99999.;
        const int SPHERE_COUNT = 8;

        float spheresMap (vec3 point) {
            vec3 center = vec3(0., 0., 0.);
            float d = 99999.;
            float sphereRand, sphereSpeed, sphereRadius;
            vec3 spherePos;
            for (int i = 0; i < SPHERE_COUNT; i++) {
                sphereRand = rand(float(i)) + rand(float(i-1));
                sphereSpeed = 1. / sphereRand;
                sphereRadius = (1. - sphereRand * sin(iTime) * cos(iTime * sphereRand)) * sphereSize;
                spherePos = vec3(
                    center.x + sin(iTime * sphereRand *  - randSignal(sphereRand) * .4), 
                    center.y  + sin(iTime * sphereRand*  + randSignal(sphereRand) * 2.4), 
                    center.z  + sin(iTime * sphereRand / .3) *  - randSignal(sphereRand) * 1.
                );
                d = opSmoothUnion(d, sdSphere(point, spherePos, sphereRadius), 1.);
            }
            return d;
        }

        float cubeMap (vec3 point) {
            vec3 center = vec3(0., 0., 0.);
            return sdBox(point, center, vec3(1.6 * cubeSize));
        }

        float map (vec3 point) {
            vec3 transformedPoint = (point + vec3(0., 0., 10.))
            * rotX(iTime * rotXAmount)
            * rotY(iTime * rotYAmount)
            * rotZ(iTime * rotZAmount);
            return opSmoothUnion(spheresMap(transformedPoint), cubeMap(transformedPoint), .4);
        }

        vec3 mainColor (vec3 point, vec3 normal, float totalDistance) {
            return (normal * normalAmount +
                diffuseLight(vec3(10., 0., 10.), vec3(.3, .4, 1.), point, normal) * diffuse1Amount +
                diffuseLight(vec3(-10., 0., 10.), vec3(1., .4, .3), point, normal) * diffuse2Amount);
        }

        vec3 background (vec3 rayOrigin, vec3 rayDirection) {
            return vec3( .0);
        }

        vec3 estimateNormal (vec3 p) {
            float EPSILON = 0.0005;
            return normalize(vec3(
                map(vec3(p.x + EPSILON, p.y, p.z)) - map(vec3(p.x - EPSILON, p.y, p.z)),
                map(vec3(p.x, p.y + EPSILON, p.z)) - map(vec3(p.x, p.y - EPSILON, p.z)),
                map(vec3(p.x, p.y, p.z  + EPSILON)) - map(vec3(p.x, p.y, p.z - EPSILON))
            ));
        }

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
    `,
].join("\n");
