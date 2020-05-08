import * as THREE from "three";
import { IUniform } from "three";
import { Node, NodeOptions } from "./Node";
import defaultUniforms from "../shaders/defaultUniforms";
import { THREENode } from "./THREENode";

const defaultVertexShader = require("../shaders/default.vert");
const defaultFragmentShader = require("../shaders/default.frag");

export interface MeshNodeOptions extends NodeOptions {
    /**
     * THREE.js geometry for this mesh
     */
    geometry: THREE.Geometry;

    /**
     * THREE.js material for this mesh
     * If no material is passed, ShaderMaterial will be used
     */
    material?: THREE.Material;

    /**
     * Vexter shader GLSL code for the ShaderMaterial
     */
    vertexShader?: string;

    /**
     * Fragment shader GLSL code for the ShaderMaterial
     */
    fragmentShader?: string;

    /**
     * Blending mode for this mesh. Default is THREE.NormalBlending
     */
    blending?: THREE.Blending;

    /**
     * Side rendering option for this mesh. Default is THREE.FrontSide
     */
    side?: THREE.Side;

    /**
     * Transparency setting for this mesh. Default is true
     */
    transparent?: boolean;

    /**
     * Depth test setting for this mesh. Default is true
     */
    depthTest?: boolean;
}

export class MeshNode extends Node {
    /**
     * THREE.js geometry for this mesh
     */
    geometry: THREE.Geometry;

    /**
     * THREE.js material for this mesh
     */
    material?: THREE.Material;

    /**
     * Mesh instance
     */
    mesh?: THREE.Mesh;

    /**
     * Mesh material uniforms for updating
     */
    uniforms: { [key: string]: IUniform } = {};

    /**
     * Options passed to the constructor when instancing the node
     */
    options: MeshNodeOptions;

    constructor(id: string, options: MeshNodeOptions) {
        super(id, options);

        this.options = options;
        this.geometry = options?.geometry;
        this.material = options.material;

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
            if (!uniforms[key]) uniforms[key] = { value: this.inputs[key].getValue() };
        }

        // instanciate the mesh
        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material ||
                new THREE.ShaderMaterial({
                    vertexShader: this.options.vertexShader || defaultVertexShader,
                    fragmentShader: this.options.fragmentShader || defaultFragmentShader,
                    uniforms: uniforms,
                    transparent:
                        this.options.transparent !== undefined ? this.options.transparent : true,
                    blending: this.options.blending || THREE.NormalBlending,
                    depthTest: this.options.depthTest !== undefined ? this.options.depthTest : true,
                    lights: true,
                    side: this.options.side || THREE.FrontSide,
                })
        );

        this.uniforms = (this.mesh.material as THREE.ShaderMaterial).uniforms;

        // update the output of the node
        this.output.setValue(this.mesh);

        this._onPrepare && this._onPrepare(this.mesh);

        return this;
    }

    onPrepare(fn: (mesh: THREE.Mesh) => void) {
        this._onPrepare = fn;
        return this;
    }

    onUpdate(fn: (time: number, mesh: THREE.Mesh) => void) {
        this._onUpdate = fn;
        return this;
    }

    update(time: number) {
        // pass the mesh to the update function for easy updating of values
        this._onUpdate && this._onUpdate(time, this.mesh);

        // update default uniforms
        this.uniforms["iTime"].value = time;

        // update node connection uniforms
        for (let key in this.inputs) {
            if (!this.uniforms[key]) this.uniforms[key] = { value: this.inputs[key].getValue() };
            else this.uniforms[key].value = this.inputs[key].getValue();
        }

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
