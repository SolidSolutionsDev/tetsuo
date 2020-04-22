/**
 * This class wraps the viewport div element
 */
export declare class Viewport {
    /**
     * Parent DOM element where the canvas is injected
     */
    domElement: HTMLElement;
    /**
     * Injected canvas where the scene is rendered
     */
    canvas: HTMLCanvasElement;
    /**
     * @param {HTMLElement} domElement - element to attach viewport to
     */
    constructor(domElement: HTMLElement);
    /**
     * Getter for the viewport DOM element width.
     */
    get width(): number;
    /**
     * Getter for the viewport DOM element height.
     */
    get height(): number;
    /**
     * Getter for the viewport DOM element size ratio (width / height).
     */
    get ratio(): number;
    /**
     * Creates an event listener that listens for the window's resize
     *
     * @param {*} onResize - callback when window resizes
     */
    createResizeListener(onResize: () => void): void;
}
//# sourceMappingURL=Viewport.d.ts.map