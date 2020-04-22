import * as THREE from "three";
import { Viewport } from "../Viewport";
import { NodeGraph } from "./NodeGraph";
import { ShaderNode } from "./ShaderNode";

export interface NodeRendererOptions {
    viewportElement?: HTMLElement;

    antialias?: boolean;

    alpha?: boolean;
}

export class NodeRenderer {
    viewport: Viewport;

    renderer: THREE.WebGLRenderer;

    nodeGraph: NodeGraph;

    camera: THREE.OrthographicCamera;

    scene: THREE.Scene;

    quad: THREE.Mesh;

    material: THREE.MeshBasicMaterial;

    targetPool: {
        targets: THREE.WebGLRenderTarget[];
        used: number;
    } = { targets: [], used: 0 };

    constructor(options?: NodeRendererOptions) {
        options = options || {};
        if (options.antialias === undefined) options.antialias = true;
        if (options.alpha === undefined) options.alpha = true;

        let viewport: HTMLElement | null = options.viewportElement || document.getElementById("viewport");

        if (!viewport) {
            throw Error("viewport element not found");
        }

        this.viewport = new Viewport(viewport);
        this.viewport.createResizeListener(() => this.onResize());

        this.renderer = new THREE.WebGLRenderer({
            antialias: options.antialias,
            alpha: options.alpha,
            canvas: this.viewport.canvas,
        });
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.sortObjects = true;
        this.renderer.autoClear = false;

        this.nodeGraph = new NodeGraph();
        this.nodeGraph.setRootNode(new ShaderNode("root", this));

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2));
        this.scene.add(this.quad);
        this.material = new THREE.MeshBasicMaterial();
    }

    update(time: number) {
        this.nodeGraph.traverse((node) => node.update(time));
    }

    render() {
        if (this.nodeGraph.root) {
            this.renderer.clear(true, true, true);

            this.nodeGraph.traverse((node) => node.render());

            let map = this.nodeGraph.root.output.getValue() as THREE.Texture;

            this.quad.material = new THREE.MeshBasicMaterial({
                map,
            });

            this.renderer.setRenderTarget(null);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);

            this.withdrawRenderTargets();
        }
    }

    createRenderTarget() {
        let target = new THREE.WebGLRenderTarget(this.viewport.width, this.viewport.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
        });

        return target;
    }

    getRenderTarget() {
        let target = this.targetPool.targets[this.targetPool.used];

        if (!target) {
            target = this.createRenderTarget();
            this.targetPool.targets[this.targetPool.used] = target;
        }

        this.targetPool.used++;

        target.texture.repeat.set(1, 1);
        target.texture.offset.set(0, 0);

        return target;
    }

    withdrawRenderTargets() {
        this.targetPool.used = 0;
    }

    onResize() {
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.targetPool.targets.forEach((target) => target.setSize(this.viewport.width, this.viewport.height));
        this.render();
    }
}
