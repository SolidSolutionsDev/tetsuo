TETSUO.Utils.ready(() => {
    let scene = new TETSUO.Scene({
        dev: true,
        viewportElement: document.getElementById("viewport"),
    });

    // add light
    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 5, 5);
    scene.addObject(light);

    // add white cube
    let cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
        })
    );
    scene.addObject(cube);

    // add post processing shader
    scene.addPostShader(
        TETSUO.PostShader({
            vertexShader: postVert,
            fragmentShader: postFrag,
        })
    );

    scene.initPostProcessing();

    // rotate cube
    scene.animate((time) => {
        cube.rotation.x += Math.sin(time) / 10;
        cube.rotation.y += Math.cos(time) / 10;
    });
});

// vertex shader distorts image
const postVert = [
    /* glsl */ `
        varying vec2 vUv;
        uniform float iTime;

        void main() {
            vec3 newPosition = vec3(position.x, position.y - sin(position.x * sin(iTime)) * 2., position.z);
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1);
        }
    `,
].join("\n");

// fragment shader changes color
const postFrag = [
    /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform float iTime;
        varying vec2 vUv;

        void main() {
            vec4 texel = texture2D( tDiffuse, vUv );
            gl_FragColor = vec4(texel.r * sin(iTime), texel.g * cos(iTime), texel.b, 1.);
        }
    `,
].join("\n");
