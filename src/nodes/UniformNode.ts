import { Node, NodeOptions } from "./Node";
import { Callback } from "../types/Callback";
import { PageUtils } from "../utils/page";

/**
 * Uniform node initialization options
 *
 * @category Nodes
 */
export interface UniformNodeOptions<T> extends NodeOptions {
    /**
     * Initial value of the uniform
     */
    value: T | null;

    /**
     * Callback when value changes
     */
    onChange?: Callback;

    /**
     * dat.gui configurations
     */
    gui?: {
        name?: string;
        min?: number;
        max?: number;
        step?: number;
    };
}

/**
 * Node for controlling uniforms in nodes
 *
 * @category Nodes
 */
export class UniformNode<T> extends Node {
    /**
     * Current uniform value
     */
    value: T | null = null;

    /**
     * Callback when value changes
     */
    onChange?: Callback;

    /**
     *
     * @param id - Node id
     * @param options - Uniform node initialization options
     */
    constructor(id: string, options: UniformNodeOptions<T>) {
        super(id, options);

        this.setValue(options.value);

        this.onChange = options.onChange;

        let gui = PageUtils.getGUI();
        if (gui) {
            gui.add(
                this,
                "value",
                options.gui?.min,
                options.gui?.max,
                options.gui?.step
            )
                .name(options.gui?.name || this.id)
                .onChange((value: any) => this.setValue(value));
        }
    }

    /**
     * Sets the uniform value
     *
     * @param value
     */
    setValue(value: T | null) {
        this.value = value;

        // update output connection value in order to propagate value change to the connected nodes
        this.output.setValue(value);

        this.onChange && this.onChange(value);

        return this;
    }
}
