// when page is ready
TETSUO.Utils.ready(() => {
    // initialize the scene
    const scene = new TETSUO.Scene({
        viewportElement: document.getElementById("viewport"),
        background: 0x1c1c1c,
        dev: true,
    });

    // add a shaded object
    scene.addObject(
        TETSUO.ShadedObject({
            geometry: new THREE.SphereGeometry(1, 50, 50),
            vertexShader: ballVert,
            fragmentShader: ballFrag,
        })
    );

    // start rendering
    scene.animate();

    const debugScene = new TETSUO.Scene({
        viewportElement: document.getElementById("debugViewport"),
    });

    debugScene.addPostShader(
        TETSUO.PostShader({
            fragmentShader: debugFrag,
        })
    );

    debugScene.initPostProcessing();

    debugScene.animate();
});

const ballVert = [
    TETSUO.Shaders.worley,
    /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vDisplacement;
        uniform float iTime;
        uniform float worleyPointDiv;
        uniform float worleyYMult;
        uniform float worleyXMult;
        uniform float worleyDiv;
        uniform float worleySpeed;

        void main() {
            float d = worleyDisp(
                        vec3(position.xy, position.z + iTime),
                        1.,
                        false,
                        2.,
                        1.,
                        1.,
                        1.
                    );
            vDisplacement = d;
            vec3 newPosition = position + normal * vDisplacement;
            vPosition = newPosition;
            vNormal = normalize(normal * vDisplacement);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1);
        }
    `,
].join("\n");

const ballFrag = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDisplacement;
    uniform sampler2D tDiffuse;
    uniform vec3 color;

    void main() {
        gl_FragColor = vec4(vec3(vDisplacement), 1.);
    }
`;

const debugFrag = [
    TETSUO.Shaders.worley,
    /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vDisplacement;
        uniform sampler2D tDiffuse;
        uniform vec3 color;
        uniform float iTime;
        
        void main() {
            gl_FragColor = vec4(vec3(worleyDisp(vec3(vUv.xy, iTime), 1., false, 4., 1., 1., 1.)), 1.);
        }
    `,
].join("\n");
