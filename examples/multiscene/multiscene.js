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
            vertexShader: document.getElementById("ballVert").innerText,
            fragmentShader: document.getElementById("ballFrag").innerText,
        })
    );

    // start rendering
    scene.animate();

    const debugScene = new TETSUO.Scene({
        viewportElement: document.getElementById("debugViewport"),
    });

    debugScene.addPostShader(
        TETSUO.PostShader({
            fragmentShader: document.getElementById("debugFrag").innerText,
        })
    );

    debugScene.initPostProcessing();

    debugScene.animate();
});
