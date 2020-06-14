import * as THREE from "three";
import { IUniform } from "three";
import { Node, NodeOptions } from "./Node";
import defaultUniforms from "../shaders/defaultUniforms";
import { THREENode } from "./THREENode";

export interface GroupNodeOptions extends NodeOptions {
    group: THREE.Group;
}

export class GroupNode extends Node {
    group: THREE.Group;

    /**
     * Options passed to the constructor when instancing the node
     */
    options: GroupNodeOptions;

    constructor(id: string, options: GroupNodeOptions) {
        super(id, options);

        this.options = options;
        this.group = options.group;

        this.prepare();
    }

    prepare() {
        // initialize the uniforms
        let uniforms: { [key: string]: IUniform } = THREE.UniformsUtils.merge([
            // three js scene uniforms
            THREE.UniformsLib["common"],
            THREE.UniformsLib["fog"],
            THREE.UniformsLib["lights"],

            defaultUniforms,
        ]);

        for (let key in this.inputs) {
            if (!uniforms[key])
                uniforms[key] = { value: this.inputs[key].getValue() };
        }

        this.group.children
            .filter(
                (mesh) =>
                    (mesh as any).material && (mesh as any).material.uniforms
            )
            .forEach((mesh) => ((mesh as any).material.uniforms = uniforms));

        // update the output of the node
        this.output.setValue(this.group);

        this._onPrepare && this._onPrepare.forEach((fn) => fn(this.group));

        return this;
    }

    onPrepare(fn: (mesh: THREE.Mesh) => void) {
        this._onPrepare.push(fn);
        return this;
    }

    onUpdate(
        fn: (totalTime: number, deltaTime: number, group: THREE.Group) => void
    ) {
        this._onUpdate.push(fn);
        return this;
    }

    update(time: number) {
        // pass the mesh to the update function for easy updating of values
        this._onUpdate && this._onUpdate.forEach((fn) => fn(time, this.group));

        this.group.children
            .filter(
                (mesh) =>
                    (mesh as any).material && (mesh as any).material.uniforms
            )
            .forEach((mesh) => {
                let uniforms = (mesh as any).material.uniforms;
                uniforms["iTime"].value = time;

                for (let key in this.inputs) {
                    if (!uniforms[key])
                        uniforms[key] = { value: this.inputs[key].getValue() };
                    else uniforms[key].value = this.inputs[key].getValue();
                }
            });

        return this;
    }

    /**
     * Connect the mesh to a THREENode
     *
     * @param node
     */
    connectTo(node: THREENode) {
        super.connectTo(node);

        // add the mesh to the THREENode scene
        node.add(this.output.getValue());

        return this;
    }
}
