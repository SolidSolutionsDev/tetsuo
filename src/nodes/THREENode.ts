import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";
import { UnmaskedMaterial, MaskedMaterial } from "../shaders/maskMaterials";

/**
 * THREE.js node initialization options
 *
 * @category Nodes
 */
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
     * Viewport element. Recommended for using controls
     */
    viewportElement?: HTMLElement;

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

    /**
     * List of mask buffers
     */
    masks?: string[];
}

/**
 * THREE.js scene node
 *
 * @category Nodes
 */
export class THREENode extends Node {
    /**
     * Internal three.js scene
     */
    scene: THREE.Scene;

    /**
     * Internal three.js camera
     */
    camera: THREE.PerspectiveCamera;

    /**
     * Whether this node will render and output a depth texture
     * If true, the output value is a struct containing 2 textures - diffuse and depth
     */
    private _depthBuffer: boolean = false;

    /**
     * Render target for this node
     */
    private _target: THREE.WebGLRenderTarget;

    /**
     * Whether to render this node only when needsUpdate is true
     */
    private _manualRender?: boolean;

    /**
     * Whether to rerender this node on the next pass (for manual render)
     */
    needsUpdate: boolean = true;

    /**
     * List of objects added to the scene
     */
    objects: any[] = [];

    private _masks?: {
        [maskKey: string]: {
            id: number;
            name: string;
            target: THREE.WebGLRenderTarget;
        };
    };

    private _controls?: OrbitControls | FirstPersonControls;

    constructor(id: string, options?: THREENodeOptions) {
        super(id, options);

        this.scene = options?.scene || new THREE.Scene();

        this.camera =
            options?.camera ||
            new THREE.PerspectiveCamera(
                options?.cameraSettings?.fov || 45,
                this.width / this.height,
                options?.cameraSettings?.near || 0.1,
                options?.cameraSettings?.far || 50
            );

        options?.cameraSettings?.position &&
            this.camera.position.copy(options.cameraSettings.position);

        this._target = new THREE.WebGLRenderTarget(this.width, this.height);

        this.output.value = null;

        if (options?.masks) {
            if (!this.output.value) this.output.value = {};

            options.masks.forEach((mask, index) => {
                if (!this._masks) this._masks = {};

                this._masks[mask] = {
                    id: index,
                    name: mask,
                    target: new THREE.WebGLRenderTarget(
                        this.width,
                        this.height
                    ),
                };

                this.output.value[mask] = null;
            });
        }

        // if depth texture is active, create it and setup the output
        this._depthBuffer = !!options && !!options.depthBuffer;
        if (this._depthBuffer) {
            if (!this.output.value) this.output.value = {};
            this.output.value.diffuse = null;
            this.output.value.depth = null;

            this._target.depthTexture = new THREE.DepthTexture(
                this.width,
                this.height
            );

            this._target.texture.format = THREE.RGBFormat;
            this._target.texture.minFilter = THREE.NearestFilter;
            this._target.texture.magFilter = THREE.NearestFilter;
            this._target.texture.generateMipmaps = false;
            this._target.stencilBuffer = false;
            this._target.depthBuffer = true;
            this._target.depthTexture.format = THREE.DepthFormat;
            this._target.depthTexture.type = THREE.UnsignedShortType;
        }

        this._manualRender = options?.manualRender;

        if (options?.orbitControls) {
            this._controls = new OrbitControls(
                this.camera,
                options?.viewportElement || document.body
            );
        } else if (options?.firstPersonControls) {
            this._controls = new FirstPersonControls(
                this.camera,
                options?.viewportElement
            );
        }
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

    /**
     * Renders the node to an output connection
     */
    render(renderer: NodeRenderer) {
        super.render(renderer);

        if (!this._manualRender || this.needsUpdate) {
            let output: any = null;

            // mask buffer rendering
            if (this._masks) {
                let preMaskMaterials: any = {};
                output = {};

                Object.keys(this._masks).forEach((maskKey) => {
                    if (!this._masks) return;

                    let mask = this._masks[maskKey];

                    // switch objects materials depending on whether they're masked or not
                    this.objects.forEach((object) => {
                        preMaskMaterials[object.uuid] = object.material;

                        if (object.masks && object.masks.includes(maskKey)) {
                            object.material = UnmaskedMaterial;
                        } else {
                            object.material = MaskedMaterial;
                        }
                    });

                    renderer.glRenderer.setRenderTarget(mask.target);
                    renderer.glRenderer.clear(true, true, true);
                    renderer.glRenderer.render(this.scene, this.camera);

                    output[maskKey] = mask.target.texture;
                });

                // reset object materials
                this.objects.forEach((object) => {
                    object.material = preMaskMaterials[object.uuid];
                });
            }

            renderer.glRenderer.setRenderTarget(this._target);
            renderer.glRenderer.clear(true, true, true);
            renderer.glRenderer.render(this.scene, this.camera);

            // update depth buffer
            if (this._depthBuffer) {
                if (!output) output = {};
                output["depth"] = this._target.depthTexture;
            }

            // update diffuse buffer
            this.output.setValue(
                output
                    ? { ...output, diffuse: this._target.texture }
                    : this._target.texture
            );

            this.needsUpdate = false;
        }

        return this;
    }

    /**
     * Handles renderer resize
     */
    resize(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this._target.setSize(width, height);

        return this;
    }

    update(totalTime: number, deltaTime: number) {
        super.update(totalTime, deltaTime);

        this._controls?.update(deltaTime);

        return this;
    }
}
