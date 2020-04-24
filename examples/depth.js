TETSUO.Utils.ready(() => {
    let scene = new TETSUO.Scene({
        dev: true,
        autoStart: true,
    });

    // create a three.js scene node
    let node = new TETSUO.THREENode("td", scene.renderer, {
        // passing this option enables depth texture rendering
        depthBuffer: true,
    });

    // initialize the scene with some spinning cubes
    let cubes = [];
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
    for (var i = 0; i < 50; i++) {
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(Math.random() * 10 - 5, Math.random() * 2 - 1, Math.random() * 20 - 20);
        cube.rotation.set(Math.random(), Math.random(), Math.random());
        cubes.push(cube);
        node.add(cube);
    }
    node.onUpdate((time) =>
        cubes.forEach((cube) => {
            cube.rotation.x += Math.sin(time) / 20;
            cube.rotation.y += Math.cos(time) / 20;
        })
    );

    // create a post processing shader to unpack the depth texture
    let post = new TETSUO.ShaderNode("post", scene.renderer, {
        fragmentShader: [
            // this contains the readDepth() function
            TETSUO.Shaders.depth,

            /* glsl */ `
                // output of the three js scene when depthBuffer option is true
                struct DiffuseAndDepth {
                    sampler2D diffuse;
                    sampler2D depth;
                };
        
                varying vec2 vUv;
                uniform DiffuseAndDepth td;
        
                void main() {
                    float depth = readDepth(td.depth, vUv);
        
                    gl_FragColor.rgb = 1. - vec3( depth );
                    gl_FragColor.a = 1.;
                }
            `,
        ].join("\n"),
    });

    // connect the scene to the shader
    node.connectTo(post);

    // output the shader
    scene.connectToScreen(post);
});
