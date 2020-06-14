import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";
import Profiler from "../core/Profiler";
import { UnmaskedMaterial, MaskedMaterial } from "../utils/maskMaterials";

export interface THREENodeOptions extends NodeOptions {
    /**
     * Whether this node will render and output a depth texture
     */
    depthBuffer?: boolean;

    /**
     * Whether to create orbit controls for the scene camera
     */
    orbitControls?: boolean;

    /**
     * Whether to create orbit controls for the scene camera
     */
    firstPersonControls?: boolean;

    /**
     * Whether to only render this node when needsUpdate flag is true
     */
    manualRender?: boolean;

    /**
     * External THREE scene to use in this node
     */
    scene?: THREE.Scene;

    /**
     * External THREE camera to use in this node
     */
    camera?: THREE.PerspectiveCamera;

    /**
     * Camera settings to apply to this node's camera
     */
    cameraSettings?: {
        position?: THREE.Vector3;
        near?: number;
        far?: number;
        fov?: number;
    };

    masks?: string[];
}

/**
 * THREE.js scene node
 */
export class THREENode extends Node {
    /**
     * Renderer where this node will be included and rendered
     */
    nodeRenderer: NodeRenderer;

    /**
     * Internal three.js scene
     */
    scene: THREE.Scene;

    /**
     * Internal three.js camera
     */
    camera: THREE.PerspectiveCamera;

    /**
     * Camera orbit controls for debug
     */
    controls?: OrbitControls | FirstPersonControls;

    /**
     * Whether this node will render and output a depth texture
     * If true, the output value is a struct containing 2 textures - diffuse and depth
     */
    depthBuffer: boolean = false;

    /**
     * Render target for this node
     */
    target: THREE.WebGLRenderTarget;

    /**
     * Whether to render this node only when needsUpdate is true
     */
    manualRender?: boolean;

    /**
     * Whether to rerender this node on the next pass (for manual render)
     */
    needsUpdate: boolean = true;

    objects: any[] = [];

    masks?: {
        [maskKey: string]: {
            id: number;
            name: string;
            target: THREE.WebGLRenderTarget;
        };
    };

    constructor(
        id: string,
        nodeRenderer: NodeRenderer,
        options?: THREENodeOptions
    ) {
        super(id, options);

        this.scene = options?.scene || new THREE.Scene();

        this.camera =
            options?.camera ||
            new THREE.PerspectiveCamera(
                options?.cameraSettings?.fov || 45,
                nodeRenderer.width / nodeRenderer.height,
                options?.cameraSettings?.near || 0.1,
                options?.cameraSettings?.far || 50
            );

        options?.cameraSettings?.position &&
            this.camera.position.copy(options.cameraSettings.position);

        this.nodeRenderer = nodeRenderer;
        this.target = new THREE.WebGLRenderTarget(
            this.nodeRenderer.width,
            this.nodeRenderer.height
        );

        this.output.value = null;

        if (options?.masks) {
            if (!this.output.value) this.output.value = {};

            options.masks.forEach((mask, index) => {
                if (!this.masks) this.masks = {};

                this.masks[mask] = {
                    id: index,
                    name: mask,
                    target: new THREE.WebGLRenderTarget(
                        this.nodeRenderer.width,
                        this.nodeRenderer.height
                    ),
                };

                this.output.value[mask] = null;
            });
        }

        if (options && this.nodeRenderer.viewport) {
            if (options.orbitControls)
                this.controls = new OrbitControls(
                    this.camera,
                    this.nodeRenderer.viewport.domElement
                );
            else if (options.firstPersonControls) {
                this.controls = new FirstPersonControls(
                    this.camera,
                    this.nodeRenderer.viewport.domElement
                );

                (this.controls as FirstPersonControls).movementSpeed = 10;
                this.controls.lookSpeed = 0.1;
            }
        }

        // if depth texture is active, create it and setup the output
        this.depthBuffer = !!options && !!options.depthBuffer;
        if (this.depthBuffer) {
            if (!this.output.value) this.output.value = {};
            this.output.value.diffuse = null;
            this.output.value.depth = null;

            this.target.depthTexture = new THREE.DepthTexture(
                this.nodeRenderer.width,
                this.nodeRenderer.height
            );

            this.target.texture.format = THREE.RGBFormat;
            this.target.texture.minFilter = THREE.NearestFilter;
            this.target.texture.magFilter = THREE.NearestFilter;
            this.target.texture.generateMipmaps = false;
            this.target.stencilBuffer = false;
            this.target.depthBuffer = true;
            this.target.depthTexture.format = THREE.DepthFormat;
            this.target.depthTexture.type = THREE.UnsignedShortType;
        }

        this.manualRender = options?.manualRender;

        Profiler.register(this);
    }

    /**
     * Adds a three.js object to the internal scene of the node
     *
     * @param object
     */
    add(object: any, masks?: string[]) {
        this.scene.add(object);

        this.objects.push(object);

        if (object.isMesh) {
            object.masks = masks;
        } else if (object.isGroup) {
            object.children.forEach((child: any) => {
                if (child.isMesh) {
                    child.masks = masks;
                }
            });
        }

        return this;
    }

    update(totalTime: number, deltaTime: number) {
        super.update(totalTime, deltaTime);
        this.controls?.update(deltaTime);
        return this;
    }

    /**
     * Renders the node to an output connection
     */
    render() {
        let initTime = performance.now();

        if (!this.manualRender || this.needsUpdate) {
            let renderer = this.nodeRenderer.renderer;

            let output: any = null;

            let preMaskMaterials: any = {};
            if (this.masks) {
                output = {};

                Object.keys(this.masks).forEach((maskKey) => {
                    if (!this.masks) return;

                    let mask = this.masks[maskKey];

                    this.objects.forEach((object) => {
                        preMaskMaterials[object.uuid] = object.material;

                        if (object.masks && object.masks.includes(maskKey)) {
                            object.material = UnmaskedMaterial;
                        } else {
                            object.material = MaskedMaterial;
                        }
                    });

                    renderer.setRenderTarget(mask.target);
                    renderer.clear(true, true, true);
                    renderer.render(this.scene, this.camera);

                    output[maskKey] = mask.target.texture;
                });

                this.objects.forEach((object) => {
                    object.material = preMaskMaterials[object.uuid];
                });
            }

            renderer.setRenderTarget(this.target);
            renderer.clear(true, true, true);
            renderer.render(this.scene, this.camera);

            // update output connection
            if (this.depthBuffer) {
                if (!output) output = {};
                output["depth"] = this.target.depthTexture;
            }

            this.output.setValue(
                output
                    ? { ...output, diffuse: this.target.texture }
                    : this.target.texture
            );

            this.needsUpdate = false;
        }

        let finalTime = performance.now();

        Profiler.update(this, finalTime - initTime);

        return this;
    }

    /**
     * Handles renderer resize
     */
    resize() {
        this.camera.aspect = this.nodeRenderer.width / this.nodeRenderer.height;
        this.camera.updateProjectionMatrix();
        this.target.setSize(this.nodeRenderer.width, this.nodeRenderer.height);

        return this;
    }
}
