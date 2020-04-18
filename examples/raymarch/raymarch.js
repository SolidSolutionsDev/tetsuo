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
            fragmentShader: document.getElementById("fragmentShader").innerText,

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
