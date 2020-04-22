import * as THREE from "three";
import { Node, NodeOptions } from "./Node";
import { NodeRenderer } from "./NodeRenderer";

export interface THREENodeOptions extends NodeOptions {}

export class THREENode extends Node {
    nodeRenderer: NodeRenderer;

    scene: THREE.Scene;

    camera: THREE.PerspectiveCamera;

    constructor(id: string, nodeRenderer: NodeRenderer, options: THREENodeOptions) {
        super(id, options);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, nodeRenderer.viewport.ratio, 1, 10000);
        this.camera.position.z = 100;

        this.nodeRenderer = nodeRenderer;
    }

    addToScene(object: any) {
        this.scene.add(object);
    }

    update(time: number) {
        super.update(time);
    }

    render() {
        let renderer = this.nodeRenderer.renderer;
        let target = this.nodeRenderer.getRenderTarget();
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
        this.output.setValue(target.texture);
    }

    resize() {
        this.camera.aspect = this.nodeRenderer.viewport.ratio;
        this.camera.updateProjectionMatrix();
    }
}
