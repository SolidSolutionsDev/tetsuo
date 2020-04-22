TETSUO.Utils.ready(() => {
    let scene = new TETSUO.Scene({ dev: true });
    let renderer = scene.renderer;

    let root = renderer.nodeGraph.root;

    let diffuse = new TETSUO.ShaderNode("tDiffuse", renderer, {
        fragmentShader: /* glsl */ `
            varying vec2 vUv;
            uniform sampler2D cubeScene;

            void main() {
                vec4 cubeTexel = texture2D(cubeScene, vUv);
                gl_FragColor = cubeTexel;
            }
        `,
    });

    let cubeScene = new TETSUO.THREENode("cubeScene", renderer);
    let cube = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50), new THREE.MeshStandardMaterial());
    cubeScene.scene.add(cube);

    var light1 = new THREE.PointLight(0xff0000, 1, 100);
    light1.position.set(50, 50, 60);
    cubeScene.scene.add(light1);

    var light2 = new THREE.PointLight(0x0000ff, 1, 100);
    light2.position.set(-50, -50, 70);
    cubeScene.scene.add(light2);

    cubeScene.connectTo(diffuse);
    diffuse.connectTo(root);

    cubeScene.onUpdate((time) => cube.rotation.set(Math.sin(time), Math.cos(time), 0));

    scene.animate();
});
