import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { Viewport } from "./Viewport";
import { Clock } from "./Clock";
import { datUniform } from "./utils";

/**
 * Scene initialization options
 */
export interface SceneOptions {
    /**
     * Element in the DOM to attach the canvas to
     */
    viewportElement: HTMLElement;

    /**
     * Whether to render x, y, z axis in the scene (only renders if dev is true)
     */
    axis?: boolean;

    /**
     * Background color of the scene (default is black)
     */
    background?: THREE.Color;

    /**
     * Whether to initialize the scene in development mode
     * This attaches dat.gui and stats element and allows for other development utilities
     */
    dev?: boolean;
}

/**
 * Scene wrapper
 */
export class Scene {
    /**
     * Viewport element handler
     */
    viewport: Viewport;

    /**
     * Three.js scene
     */
    scene: THREE.Scene;

    /**
     * Three.js camera
     */
    camera: THREE.PerspectiveCamera;

    /**
     * Clock for animating
     */
    clock: Clock;

    /**
     * Three.js WebGL renderer
     */
    renderer: THREE.WebGLRenderer;

    /**
     * Post-processing effects composer
     */
    composer: EffectComposer | null = null;

    /**
     * List of objects present in the scene
     */
    objects: THREE.Mesh[] = [];

    /**
     * List of post-processing shaders in the composer
     */
    shaders: ShaderPass[] = [];

    /**
     * Three.js orbit controls for movement in development
     */
    controls: OrbitControls | null = null;

    /**
     * Stats (fps etc) instance
     */
    stats: Stats | null = null;

    /**
     * Whether this scene is in development mode (dat.gui, stats)
     */
    dev: boolean = false;

    constructor({ viewportElement, axis, background, dev }: SceneOptions) {
        // initialize viewport DOM element handler
        this.viewport = new Viewport(viewportElement);
        this.viewport.createResizeListener(() => this.onResize());

        // initialize three.js scene
        this.scene = new THREE.Scene();
        if (background) this.scene.background = new THREE.Color(background);

        // initialize three.js camera
        this.camera = new THREE.PerspectiveCamera(75, this.viewport.ratio);
        this.camera.position.z = 5;

        // initialize three.js renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.viewport.canvas,
        });
        this.renderer.setSize(this.viewport.width, this.viewport.height);

        // initialize the clock
        this.clock = new Clock();

        // dev utils initialization
        this.dev = !!dev;
        if (this.dev) {
            // create x, y, z axis in the scene origin
            if (axis) {
                this.createAxis();
            }

            // initialize orbit controls for debug movement
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);

            // initialize a dat.gui instance (if one does not exist in the page already)
            if (!(window as any)["tetsuoGui"]) (window as any)["tetsuoGui"] = new dat.GUI();

            // add a stats element to the viewport for tracking fps
            this.stats = new Stats();
            this.viewport.domElement.appendChild(this.stats.dom);
        }
    }

    /**
     *  Adds x, y, z axis on the origin of the scene
     */
    createAxis() {
        let _x = new THREE.Vector3(1, 0, 0);
        let _y = new THREE.Vector3(0, 1, 0);
        let _z = new THREE.Vector3(0, 0, 1);
        let _origin = new THREE.Vector3(0, 0, 0);
        this.scene.add(new THREE.ArrowHelper(_x, _origin, 1, 0xff0000));
        this.scene.add(new THREE.ArrowHelper(_y, _origin, 1, 0x00ff00));
        this.scene.add(new THREE.ArrowHelper(_z, _origin, 1, 0x0000ff));
    }

    /**
     * Add an object (mesh, light, etc) to the scene
     *
     * @param object
     */
    addObject(object: any) {
        this.objects.push(object);
        this.scene.add(object);

        // update mousePos uniform on mouse movement
        this.viewport.domElement.addEventListener("mousemove", (e) => {
            object.material &&
                object.material.uniforms &&
                object.material.uniforms["mousePos"].value.set(e.offsetX, e.offsetY);
        });

        // add any uniforms with gui = true to dat.gui automatically
        if ((window as any)["tetsuoGui"] && object.material && object.material.uniforms) {
            Object.keys(object.material.uniforms).forEach((uniform) => {
                if (object.material.uniforms[uniform] && object.material.uniforms[uniform].gui)
                    datUniform(
                        (window as any)["tetsuoGui"],
                        object.material,
                        uniform,
                        uniform,
                        object.material.uniforms[uniform].onChange
                    );
            });
        }

        return object;
    }

    /**
     * Add a post-processing shader to the effects composer chain
     *
     * @param shader
     */
    addPostShader(shader: any) {
        const shaderPass = new ShaderPass(shader);
        this.shaders.push(shaderPass);

        // update mousePos uniform on mouse movement
        this.viewport.domElement.addEventListener("mousemove", (e) => {
            (shaderPass.uniforms as any)["mousePos"].value.set(e.offsetX, e.offsetY);
        });

        // add any uniforms with gui = true to dat.gui automatically
        if ((window as any)["tetsuoGui"]) {
            Object.keys(shader.uniforms).forEach((uniform) => {
                if (shader.uniforms[uniform].gui)
                    datUniform(
                        (window as any)["tetsuoGui"],
                        shaderPass,
                        uniform,
                        uniform,
                        shader.uniforms[uniform].onChange
                    );
            });
        }

        return shaderPass;
    }

    /**
     * Initializes the post-processing effects chain. Run after shaders have been added
     */
    initPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        // first link in the chain extracts scene render
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // add each of the shaders in the shaders list
        if (this.shaders.length > 0) {
            for (let i = 0; i < this.shaders.length; i++) {
                const shaderPass = this.shaders[i];
                this.composer.addPass(shaderPass);
            }
        }

        // last link renders the content of the chain
        const outputPass = new ShaderPass(CopyShader);
        outputPass.renderToScreen = true;
        this.composer.addPass(outputPass);
    }

    /**
     * Animate method.
     * Renders the scene, updates uniforms, updates dev utils, etc
     *
     * @param onTick - Callback when animation ticks
     */
    animate(onTick: (time?: number) => void) {
        if (this.dev) {
            // start counting fps time for this frame
            this.stats && this.stats.begin();

            // Iterate over all dat.gui controllers and update values
            if ((window as any)["tetsuoGui"]) {
                for (let i in (window as any)["tetsuoGui"].__controllers) {
                    (window as any)["tetsuoGui"].__controllers[i].updateDisplay();
                }
            }
        }

        let clockDelta = this.clock.tick();

        // callback
        onTick && onTick(this.clock.getElapsedTime());

        // render post-processing effects
        if (this.composer) {
            this.composer.render(clockDelta);

            // update post processing uniforms
            if (this.shaders.length > 0) {
                this.shaders.forEach((shaderPass) => {
                    (shaderPass.uniforms as any)["iTime"].value = this.clock.getElapsedTime();
                    (shaderPass.uniforms as any)["iResolution"].value.set(this.viewport.width, this.viewport.height, 1);
                });
            }
        }
        // render the scene
        else {
            this.renderer.render(this.scene, this.camera);
        }

        // update shaded objects uniforms
        if (this.objects.length > 0) {
            this.objects.forEach((obj) => {
                if (obj.material && (obj.material as any)["uniforms"]) {
                    if ((obj.material as any)["uniforms"].iTime) {
                        (obj.material as any)["uniforms"].iTime.value = this.clock.getElapsedTime();
                    }
                    if ((obj.material as any)["uniforms"].iResolution) {
                        (obj.material as any)["uniforms"].iResolution.value.set(
                            this.viewport.width,
                            this.viewport.height,
                            1
                        );
                    }
                }
            });
        }

        // update orbit controls
        this.controls && this.controls.update();

        if (this.dev) {
            // finish counting fps time
            this.stats && this.stats.end();
        }

        requestAnimationFrame(() => this.animate(onTick));
    }

    /**
     * Window resize handler
     */
    onResize() {
        // recalculate camera aspect ratio
        this.camera.aspect = this.viewport.ratio;
        this.camera.updateProjectionMatrix();

        // resize renderer
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }

    /**
     * Jump clock elapsed time
     */
    jumpClock(diff: number) {
        this.clock.jump(diff);
    }
}
