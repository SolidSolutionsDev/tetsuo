import Stats from "stats.js";
import { Clock } from "./Clock";
import { NodeRenderer } from "../nodes/NodeRenderer";
import { Node } from "../nodes/Node";
import { THREENode } from "../nodes/THREENode";
import dat from "dat.gui";
import TETSUO from "..";

/**
 * Scene initialization options
 *
 * @Category Core
 */
export interface SceneOptions {
    /**
     * Element where the renderer will drop its canvas
     */
    viewportElement?: HTMLElement;

    /**
     * Whether to initialize the scene in development mode
     * This attaches dat.gui and stats element and allows for other development utilities
     */
    dev?: boolean;

    /**
     * Whether to start the animation loop automatically when the scene is created.
     */
    autoStart?: boolean;
}

/**
 * This class wraps a node renderer and a clock for providing a loop.
 *
 * @category Core
 */
export class Scene {
    /**
     * Clock that provides the animation loop
     */
    clock: Clock;

    /**
     * Node renderer
     */
    renderer: NodeRenderer;

    /**
     * Stats.js instance for debugging. Automatically attached to the viewport element
     */
    private _stats: Stats | null = null;

    /**
     * Whether this scene is in development mode (for displaying stats)
     */
    dev: boolean = false;

    /**
     * Whether to start the animation loop automatically when the scene is created.
     */
    autoStart: boolean = false;

    /**
     * @param options - Scene options
     */
    constructor(options: SceneOptions) {
        // initialize renderer
        this.renderer = new NodeRenderer({
            viewportElement: options.viewportElement,
        });

        // initialize the clock
        this.clock = new Clock(
            options.autoStart,
            (elapsed, delta, frameCount) =>
                this.animate(elapsed, delta, frameCount)
        );

        // dev utils initialization
        this.dev = !!options.dev;
        if (this.dev) {
            // add a stats element to the viewport for tracking fps
            this._stats = new Stats();
            this.renderer.viewport &&
                this.renderer.viewport.domElement.appendChild(this._stats.dom);

            (window as any)["TETSUO"].gui = new dat.GUI();

            TETSUO.Logger.setLevel("info");
        }
    }

    /**
     * Animate method.
     * Renders the scene, updates uniforms, updates dev utils, etc
     *
     * @param onTick - Callback when animation ticks
     */
    animate(elapsed: number, delta: number, frameCount: number) {
        if (this.dev) {
            // start counting fps time for this frame
            this._stats && this._stats.begin();
        }

        // update all nodes in the render
        this.renderer.update(elapsed, delta);

        // render all nodes
        this.renderer.render();

        if (this.dev) {
            // finish counting fps time
            this._stats && this._stats.end();
        }
    }

    /**
     * Creates a basic scene for three.js.
     */
    basic(): { scene: Scene; node: Node } {
        let node = new THREENode();

        this.connectToScreen(node);

        return { scene: this, node };
    }

    connectToScreen(node: Node) {
        this.renderer.connectToScreen(node);
    }

    /**
     * Jump clock elapsed time
     */
    jumpClock(diff: number) {
        this.clock.jump(diff);
    }
}
