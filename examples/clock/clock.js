// when page is ready
TETSUO.Utils.ready(() => {
    // initialize scene
    let { scene, node } = new TETSUO.Scene({
        viewportElement: document.getElementById("viewport"),
        background: 0x1c1c1c,
        dev: true,
        axis: true,
    }).basic();

    // add an object
    let object = new THREE.Mesh(
        new THREE.SphereGeometry(20, 20, 20),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    node.add(object);

    // add a light
    node.add(new THREE.DirectionalLight(0xffffff, 0.5));

    // start animation loop
    scene.animate((time) => {
        time /= 10;
        object.position.set(Math.sin(time) * 20, Math.cos(time) * 20, 0);
        document.getElementById("elapsed").innerHTML = scene.clock.getElapsedTime();
    });

    // setup time jump methods
    window.jumpBack = () => scene.jumpClock(-1);
    window.startStop = () => scene.clock.pause();
    window.jumpForward = () => scene.jumpClock(1);
});
