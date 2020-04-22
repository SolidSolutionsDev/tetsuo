import { Node, NodeOptions } from "./Node";

export interface UniformGuiOptions {
    /**
     * Whether to hide the control from dat.gui
     */
    hide?: boolean;

    /**
     * Alias for the controller
     * If not set, controller name will be node ID
     */
    alias?: string;

    /**
     * Uniform minimum value
     */
    minValue?: number;

    /**
     * Uniform maximum value
     */
    maxValue?: number;

    /**
     * Controller value change step amount
     */
    step?: number;
}

export interface UniformNodeOptions<T> extends NodeOptions {
    /**
     * Initial value of the uniform
     */
    value: T | null;

    /**
     * Callback when value changes
     */
    onChange?: (value?: any) => void;

    /**
     * dat.gui controller configuration
     */
    gui?: UniformGuiOptions;
}

/**
 * Node for uniform control
 */
export class UniformNode<T> extends Node {
    /**
     * Current uniform value
     */
    value: T | null = null;

    /**
     * Callback when value changes
     */
    onChange?: (value?: any) => void;

    constructor(id: string, options: UniformNodeOptions<T>) {
        super(id, options);

        this.setValue(options.value);

        this.onChange = options.onChange;

        this.setupGui(options.gui);
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

    /**
     * Sets up a dat.gui controller for this uniform
     *
     * @param options - dat.gui configuration
     */
    setupGui(options?: UniformGuiOptions) {
        options = options || {};
        let gui: dat.GUI = (window as any).TETSUO.gui;
        if (gui && !options.hide) {
            gui.add(this, "value", options.minValue, options.maxValue, options.step)
                .name(options.alias || this.id)
                .onChange((value: T) => {
                    this.setValue(value);
                });
        }

        return this;
    }
}
