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
    material: THREE.ShaderMaterial;

    constructor(id: string, options?: MaterialNodeOptions) {
        super(id, options);

        this.material = ShaderMaterial({
            ...options,
            vertexShader: options?.vertexShader || defaultMaterialNodeVertex,
            fragmentShader: options?.fragmentShader || defaultMaterialNodeFrag,
        });
    }

    prepare() {
        super.prepare();

        this.output.setValue(this.material);

        return this;
    }
}
