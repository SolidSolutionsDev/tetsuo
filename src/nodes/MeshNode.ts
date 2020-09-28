import * as THREE from "three";
import { IUniform } from "three";
import { Node, NodeOptions } from "./Node";
import defaultUniforms from "../shaders/defaultUniforms";
import { THREENode } from "./THREENode";
import { Callback } from "../types/Callback";
import { uniqueID } from "../utils/general";

const defaultVertexShader = require("../shaders/default.vert");
const defaultFragmentShader = require("../shaders/default.frag");

/**
 * Mesh node initialization options
 *
 * @category Nodes
 */
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

/**
 * THREE.js mesh node to be used with {@link THREENode}
 *
 * @category Nodes
 */
export class MeshNode extends Node {
    /**
     * THREE.js geometry for this mesh
     */
    private _geometry: THREE.Geometry;

    /**
     * THREE.js material for this mesh
     */
    private _material?: THREE.Material;

    /**
     * Mesh instance
     */
    private _mesh?: THREE.Mesh;

    /**
     * Mesh material uniforms for updating
     */
    private _uniforms: { [key: string]: IUniform } = {};

    /**
     * Options passed to the constructor when instancing the node
     */
    options: MeshNodeOptions;

    constructor(options: MeshNodeOptions) {
        super({ ...options, id: options?.id || uniqueID("MeshNode_") });

        this.options = options;
        this._geometry = options?.geometry;
        this._material = options.material;

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

        // instanciate the mesh
        this._mesh = new THREE.Mesh(
            this._geometry,
            this._material ||
                new THREE.ShaderMaterial({
                    vertexShader:
                        this.options.vertexShader || defaultVertexShader,
                    fragmentShader:
                        this.options.fragmentShader || defaultFragmentShader,
                    uniforms: uniforms,
                    transparent:
                        this.options.transparent !== undefined
                            ? this.options.transparent
                            : true,
                    blending: this.options.blending || THREE.NormalBlending,
                    depthTest:
                        this.options.depthTest !== undefined
                            ? this.options.depthTest
                            : true,
                    lights: true,
                    side: this.options.side || THREE.FrontSide,
                })
        );

        this._uniforms = (this._mesh.material as THREE.ShaderMaterial).uniforms;

        // update the output of the node
        this.output.setValue(this._mesh);

        this._onPrepare && this._onPrepare.forEach((fn) => fn(this._mesh));

        return this;
    }

    onPrepare(fn: Callback) {
        this._onPrepare.push(fn);
        return this;
    }

    onUpdate(fn: Callback) {
        this._onUpdate.push(fn);
        return this;
    }

    update(time: number) {
        // pass the mesh to the update function for easy updating of values
        this._onUpdate && this._onUpdate.forEach((fn) => fn(time, this._mesh));

        if (this._uniforms) {
            // update default uniforms
            this._uniforms["iTime"].value = time;

            // update node connection uniforms
            for (let key in this.inputs) {
                if (!this._uniforms[key])
                    this._uniforms[key] = {
                        value: this.inputs[key].getValue(),
                    };
                else this._uniforms[key].value = this.inputs[key].getValue();
            }
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
