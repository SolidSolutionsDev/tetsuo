TETSUO.PageUtils.prepareViewport({
    width: 800,
    height: 480,
    border: true,
    borderColor: "gray",
});

let scene = new TETSUO.Scene({ dev: true, autoStart: true });

let frag = TETSUO.Shaders.compile(
    TETSUO.Shaders.RaymarchLib.uniforms,
    TETSUO.Shaders.RaymarchLib.structs,
    TETSUO.Shaders.RaymarchLib.sdf,

    /* glsl */ `
        mapHit map (vec3 point) {
            float sphere1 = sdSphere(point, vec3(.5, 0., 0.), 0.2);
            float sphere2 = sdSphere(point, vec3(-.5, 0., 0.), 0.2);
            float dist = 0.;

            if (sphere1 < sphere2) {
                return mapHit(sphere1, 0.);
            } 

            dist = sphere2;

            return mapHit(dist, 1.);;
        }
    `,

    TETSUO.Shaders.RaymarchLib.ray,

    /* glsl */ `
        vec4 mainColor (hit h) {
            return vec4(h.material);
        }   

        vec4 background () {
            return mix(vec4(.7, .7, 1., 1.), vec4(.5, .5, 1., 1.), 1. - vUv.y);
        }
    `,

    TETSUO.Shaders.RaymarchLib.main
);

let shaderNode = new TETSUO.ShaderNode("shaderNode", {
    fragmentShader: frag,
});

scene.connectToScreen(shaderNode);
