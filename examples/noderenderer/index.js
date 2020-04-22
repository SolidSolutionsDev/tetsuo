TETSUO.Utils.ready(() => {
    let scene = new TETSUO.Scene({ dev: true });
    let renderer = scene.renderer;

    let root = renderer.nodeGraph.root;

    let diffuse = new TETSUO.ShaderNode(renderer, {
        id: "tDiffuse",
        fragmentShader: /* glsl */ `
            varying vec2 vUv;
            uniform sampler2D red;
            uniform sampler2D green;

            void main() {
                vec4 redTexel = texture2D(red, vUv);
                vec4 greenTexel = texture2D(green, vUv);
                gl_FragColor = redTexel + greenTexel;
            }
        `,
    });

    let red = new TETSUO.ShaderNode(renderer, {
        id: "red",
        fragmentShader: /* glsl */ `
            varying vec2 vUv;
            uniform sampler2D uvColor;

            void main() {
                vec4 texel = texture2D(uvColor, vUv);
                gl_FragColor = vec4(texel.x, 0., 0., 1.);
            }
        `,
    });

    let green = new TETSUO.ShaderNode(renderer, {
        id: "green",
        fragmentShader: /* glsl */ `
            varying vec2 vUv;
            uniform sampler2D uvColor;

            void main() {
                vec4 texel = texture2D(uvColor, vUv);
                gl_FragColor = vec4(0., texel.y, 0., 1.);
            }
        `,
    });

    let uvColor = new TETSUO.ShaderNode(renderer, {
        id: "uvColor",
        fragmentShader: /* glsl */ `
            varying vec2 vUv;

            void main() {
                gl_FragColor = vec4(vUv, 0., 1.);
            }
        `,
    });

    uvColor.connectTo(red);
    uvColor.connectTo(green);
    green.connectTo(diffuse);
    red.connectTo(diffuse);
    diffuse.connectTo(root);

    scene.animate();
});
