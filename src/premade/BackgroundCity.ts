import * as THREE from "three";
import { Premade } from "./Premade";
import { NodeRenderer } from "../nodes/NodeRenderer";
import { ShaderNode } from "../nodes/ShaderNode";
import { Node } from "../nodes/Node";
import { THREENode } from "../nodes/THREENode";
import { ShaderMaterial } from "../utils/ShaderMaterial";
import { Shaders } from "../shaders";
import { MeshNode } from "../nodes/MeshNode";
import { randomInInterval } from "../utils/utils";
import { FogNode } from "../nodes/effects/FogNode";
import { AnaglyphNode } from "../nodes/effects/AnaglyphNode";

export interface BackgroundCityOptions {
    /**
     * Width of the screen
     */
    width: number;

    /**
     * Height of the screen
     */
    height: number;
}

export interface BackgroundCityUpdateOptions {}

export class BackgroundCity implements Premade {
    /**
     * Output texture to which the screen is rendered
     */
    texture?: THREE.Texture;

    /**
     * Output quad which shader material holds the render of the screen
     */
    quad?: THREE.Mesh;

    protected _renderer: NodeRenderer;
    protected _elapsedTime: number = 0;
    protected _outputNode?: Node;
    protected _width: number;
    protected _height: number;

    constructor(options: BackgroundCityOptions) {
        // set default values
        this._width = options.width;
        this._height = options.height;

        this._renderer = new NodeRenderer({
            noViewport: true,
            width: this._width,
            height: this._height,
        });
    }

    /**
     * Builds the screen
     */
    prepare() {
        return new Promise<any>((resolve, reject) => {
            let digiverse = new THREENode("digiverse", this._renderer, {
                depthBuffer: true,
                cameraSettings: {
                    near: 1.3,
                    far: 400,
                    fov: 70,
                },

                onPrepare: () => {
                    digiverse.camera.position.y = 10;
                    digiverse.camera.position.x = 0;
                    digiverse.camera.position.z = 200;
                    digiverse.camera.lookAt(new THREE.Vector3(0, 0, 0));

                    console.log("prepares");
                },
            });

            let floorMaterial = ShaderMaterial({
                fragmentShader: Shaders.compile(
                    Shaders.simplex,
                    /*glsl */ `
                        varying vec2 vUv;
                        uniform float iTime;


                        void main() {
                            float v = abs(sin(100. * 100. * (vUv.y - iTime / 5.))) + sin(230. * vUv.y + iTime * 5.) * 0.2;
                            float n = snoise(vec3(vUv.x * 200., vUv.y * 200., iTime));
                            gl_FragColor = vec4(mix(vec3(v) *  vec3(0.1, 0.4, .4), vec3(n), 0.04), 1.);
                        }
                    `
                ),
            });

            digiverse.onUpdate((time) => (floorMaterial.uniforms.iTime.value = time));

            new MeshNode("floor", {
                geometry: new THREE.PlaneBufferGeometry(2000, 2000, 200, 100) as any,

                material: floorMaterial,

                onPrepare: (mesh) => {
                    mesh.position.y = 0;
                    mesh.rotation.x = -Math.PI / 2;
                },

                onUpdate: (time, mesh) => {
                    mesh.position.z = digiverse.camera.position.z;
                },
            }).connectTo(digiverse);

            let boxMaterial = ShaderMaterial({
                fragmentShader: Shaders.compile(
                    Shaders.simplex,
                    /*glsl */ `
                        varying vec2 vUv;
                        uniform float iTime;

                        void main() {
                            float v = abs(sin(2. * 100. * (vUv.y - iTime * 5. / 1.)));
                            float n = snoise(vec3(vUv.x * 3., vUv.y * 2., iTime));
                            gl_FragColor = vec4(mix(vec3(v) *  vec3(0.4, 1., 1.), vec3(n), 0.1),  1. - n * 0.5);
                        }
                    `
                ),
            });

            let boxes: THREE.Mesh[] = [];

            let config = {
                street: 15,

                w: 5,
                minh: 10,
                maxh: 25,

                minspacing: 10,
                maxspacing: 10,

                noAhead: 10,
                noSide: 10,
            };

            for (let iSide = 0; iSide < config.noSide; iSide++) {
                for (let iAhead = 0; iAhead < config.noAhead; iAhead++) {
                    let lheight = randomInInterval(config.minh, config.maxh);

                    let l = new THREE.Mesh(
                        new THREE.BoxGeometry(config.w, lheight, config.w),
                        boxMaterial
                    );
                    boxes.push(l);

                    digiverse.add(l);

                    l.position.set(
                        -config.street -
                            iSide *
                                (randomInInterval(config.minspacing, config.maxspacing) + config.w),
                        lheight / 2,
                        -iAhead *
                            (randomInInterval(config.minspacing, config.maxspacing) + config.w)
                    );

                    let rheight = randomInInterval(config.minh, config.maxh);

                    let r = new THREE.Mesh(
                        new THREE.BoxGeometry(config.w, rheight, config.w),
                        boxMaterial
                    );
                    boxes.push(r);

                    digiverse.add(r);

                    r.position.set(
                        config.street +
                            iSide *
                                (randomInInterval(config.minspacing, config.maxspacing) + config.w),
                        rheight / 2,
                        -iAhead *
                            (randomInInterval(config.minspacing, config.maxspacing) + config.w)
                    );
                }
            }

            digiverse.onUpdate((time) => {
                digiverse.camera.position.z = -time * 10;
                digiverse.camera.rotation.y = Math.sin(time) / 4;

                boxMaterial.uniforms.iTime.value = time;

                boxes.forEach((box) => {
                    if (box.position.z > digiverse.camera.position.z) {
                        box.position.z =
                            digiverse.camera.position.z -
                            config.noAhead *
                                (randomInInterval(config.minspacing, config.maxspacing) + config.w);
                    }
                });
            });

            let fog = new FogNode("fog", this._renderer)
                .addInput(digiverse, "inputTex")
                .uniform("near", 10, "fog near")
                .uniform("far", 1400, "fog far");

            let ana = new AnaglyphNode("ana", this._renderer)
                .addInput(fog, "inputTex")
                .uniform("amount", 0.009, "anaglyph amt.");

            this._outputNode = ana;

            this.update(0);

            this.texture = this._outputNode.output.getValue();
            this.quad = (this._outputNode as ShaderNode).quad;

            this._renderer.connectToScreen(this._outputNode);

            resolve(this.quad);
        });
    }

    /**
     * Updates the screen
     *
     * @param time - Current animation time
     * @param updateOptions - Update options to override defaults
     */
    update(deltaTime: number, updateOptions?: BackgroundCityUpdateOptions) {
        this._elapsedTime += deltaTime;
        this._render(this._elapsedTime / 1000);
    }

    /**
     * Renders the screen
     *
     * @param time
     */
    _render(time: number) {
        if (!this._outputNode) return;
        this._renderer.update(time);
        this._renderer.render();

        this.texture = this._outputNode.output.getValue();
        this.quad = (this._outputNode as ShaderNode)?.quad;
    }

    /**
     * Retrieves the output texture for external use
     */
    getTexture() {
        return this.texture;
    }

    /**
     * Retrieves the output quad for external use
     */
    getQuad() {
        return this.quad;
    }
}
