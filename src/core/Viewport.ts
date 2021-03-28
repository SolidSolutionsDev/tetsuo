import { Callback } from "../types/Callback";

/**
 * This class wraps the viewport div element that will contain the canvas
 *
 * @category Core
 */
export class Viewport {
    /**
     * Parent DOM element where the canvas is injected
     */
    domElement: HTMLElement;

    /**
     * Injected canvas where the scene is rendered
     */
    canvas: HTMLCanvasElement;

    /**
     * @param domElement - element to attach viewport to
     */
    constructor(domElement: HTMLElement) {
        this.domElement = domElement;

        // inject a canvas element
        this.canvas = document.createElement("canvas");
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.domElement.appendChild(this.canvas);
    }

    /**
     * Getter for the viewport DOM element width.
     */
    get width(): number {
        return this.domElement.getBoundingClientRect().width;
    }

    /**
     * Getter for the viewport DOM element height.
     */
    get height(): number {
        return this.domElement.getBoundingClientRect().height;
    }

    /**
     * Getter for the viewport DOM element size ratio (width / height).
     */
    get ratio(): number {
        const rect = this.domElement.getBoundingClientRect();
        return rect.width / rect.height;
    }

    /**
     * Creates an event listener that listens for the window's resize
     *
     * @param onResize - callback when window resizes
     */
    createResizeListener(onResize: Callback) {
        window.addEventListener("resize", () => {
            onResize && onResize();
        });
    }
}
