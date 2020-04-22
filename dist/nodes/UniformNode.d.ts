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
export declare class UniformNode<T> extends Node {
    /**
     * Current uniform value
     */
    value: T | null;
    /**
     * Callback when value changes
     */
    onChange?: (value?: any) => void;
    constructor(id: string, options: UniformNodeOptions<T>);
    /**
     * Sets the uniform value
     *
     * @param value
     */
    setValue(value: T | null): this;
    /**
     * Sets up a dat.gui controller for this uniform
     *
     * @param options - dat.gui configuration
     */
    setupGui(options?: UniformGuiOptions): this;
}
//# sourceMappingURL=UniformNode.d.ts.map