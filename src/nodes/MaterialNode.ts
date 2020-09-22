import { ShaderMaterial } from "../shaders/ShaderMaterial";
import { Node, NodeOptions } from "./Node";

const defaultMaterialNodeVertex = require("../shaders/defaultMaterialNode.vert");
const defaultMaterialNodeFrag = require("../shaders/defaultMaterialNode.frag");

export interface MaterialNodeOptions extends NodeOptions {
    /**
     * Custom vertex shader for the material
     */
    vertexShader?: string;

    /**
     * Custom fragment shader for the material
     */
    fragmentShader?: string;

    /**
     * Whether the object is a THREE.Points (particles) instance
     */
    points?: boolean;

    /**
     * Which blending equation to use to blend this material
     */
    blending?: THREE.Blending;

    /**
     * Whether this material is transparent
     */
    transparent?: boolean;

    /**
     * Whether to have depth test enabled when rendering this material
     */
    depthTest?: boolean;

    /**
     * Custom uniforms for this material
     */
    uniforms?: { [key: string]: { value: any; gui?: boolean } };

    /**
     * Which side of faces will be rendered
     */
    side?: THREE.Side;
}

export class MaterialNode extends Node {
    /**
     * Output material
     */
    material: THREE.ShaderMaterial;

    /**
     * Custom uniforms for this material
     */
    uniforms: { [key: string]: { value: any; gui?: boolean } };

    constructor(id: string, options?: MaterialNodeOptions) {
        super(id, options);

        this.material = ShaderMaterial({
            ...options,
            uniforms: { ...options?.uniforms, inputTex: { value: null } },
            vertexShader: options?.vertexShader || defaultMaterialNodeVertex,
            fragmentShader: options?.fragmentShader || defaultMaterialNodeFrag,
        });

        this.uniforms = this.material.uniforms;
    }

    prepare() {
        super.prepare();

        this.output.setValue(this.material);

        return this;
    }

    /**
     * Updates shader's uniforms
     *
     * @param time - Current clock time
     */
    update(totalTime: number, deltaTime: number) {
        super.update(totalTime, deltaTime);

        // update default uniforms
        this.uniforms["iTime"].value = totalTime;
        this.uniforms["iResolution"].value.set(this.width, this.height, 1);

        // update node connection uniforms
        for (let key in this.inputs) {
            if (!this.uniforms[key])
                this.uniforms[key] = { value: this.inputs[key].getValue() };
            else this.uniforms[key].value = this.inputs[key].getValue();
        }

        return this;
    }
}
