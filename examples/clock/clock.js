// when page is ready
TETSUO.Utils.ready(() => {
    // initialize scene
    let scene = new TETSUO.Scene({
        viewportElement: document.getElementById("viewport"),
        background: 0x1c1c1c,
        dev: true,
        axis: true,
    });

    // add an object
    let object = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 20, 20),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    );
    scene.addObject(object);

    // add a light
    scene.addObject(new THREE.DirectionalLight(0xffffff, 0.5));

    // start animation loop
    scene.animate((time) => {
        object.position.set(Math.sin(time), Math.cos(time), 0);
        document.getElementById("elapsed").innerHTML = scene.clock.getElapsedTime();
    });

    // setup time jump methods
    window.jumpBack = () => scene.jumpClock(-0.5);
    window.startStop = () => scene.clock.pause();
    window.jumpForward = () => scene.jumpClock(0.5);
});
