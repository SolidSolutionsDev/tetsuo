import * as THREE from "three";
import { Viewport } from "../Viewport";
import { Node } from "./Node";
import { NodeGraph } from "./NodeGraph";

export interface NodeRendererOptions {
    viewportElement?: HTMLElement;

    dev?: boolean;

    antialias?: boolean;

    alpha?: boolean;
}

export class NodeRenderer {
    viewport: Viewport;

    renderer: THREE.WebGLRenderer;

    dev: boolean = false;

    stats: Stats | null = null;

    nodeGraph: NodeGraph;

    camera: THREE.OrthographicCamera;

    scene: THREE.Scene;

    quad: THREE.Mesh;

    material: THREE.MeshBasicMaterial;

    constructor({ viewportElement, dev, antialias = true, alpha = true }: NodeRendererOptions) {
        let viewport: HTMLElement | null = viewportElement || document.getElementById("viewport");

        if (!viewport) {
            throw Error("viewport element not found");
        }

        this.viewport = new Viewport(viewport);
        this.viewport.createResizeListener(() => this.onResize());

        this.renderer = new THREE.WebGLRenderer({
            antialias: antialias,
            alpha: alpha,
            canvas: this.viewport.canvas,
        });
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.sortObjects = true;
        this.renderer.autoClear = false;

        this.nodeGraph = new NodeGraph();

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2));
        this.scene.add(this.quad);
        this.material = new THREE.MeshBasicMaterial();

        this.dev = !!dev;
        if (this.dev) {
            this.stats = new Stats();
            this.viewport.domElement.appendChild(this.stats.dom);
        }
    }

    update(time: number) {
        this.nodeGraph.traverse((node) => node.update(time));
    }

    render() {
        if (this.nodeGraph.root) {
            this.renderer.clear(true, true, true);

            this.nodeGraph.traverse((node) => node.render(this.renderer));

            let map = this.nodeGraph.root.output.getValue() as THREE.Texture;

            this.quad.material = new THREE.MeshBasicMaterial({
                map,
            });

            this.renderer.setRenderTarget(null);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }
}
