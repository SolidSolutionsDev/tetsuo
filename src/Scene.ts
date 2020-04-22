import Stats from "stats.js";
import { Clock } from "./Clock";
import { NodeRenderer } from "./nodes/NodeRenderer";

/**
 * Scene initialization options
 */
export interface SceneOptions {
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
 * Scene wrapper
 */
export class Scene {
    /**
     * Clock for animating
     */
    clock: Clock;

    renderer: NodeRenderer;

    /**
     * Stats (fps etc) instance
     */
    stats: Stats | null = null;

    /**
     * Whether this scene is in development mode (dat.gui, stats)
     */
    dev: boolean = false;

    /**
     * Whether to start the animation loop automatically when the scene is created.
     */
    autoStart: boolean = false;

    constructor({ dev, autoStart }: SceneOptions) {
        // initialize renderer
        this.renderer = new NodeRenderer();

        // initialize the clock
        this.clock = new Clock();

        // dev utils initialization
        this.dev = !!dev;
        if (this.dev) {
            // TODO datgui

            // add a stats element to the viewport for tracking fps
            this.stats = new Stats();
            this.renderer.viewport.domElement.appendChild(this.stats.dom);
        }

        autoStart && this.animate();
    }

    /**
     * Animate method.
     * Renders the scene, updates uniforms, updates dev utils, etc
     *
     * @param onTick - Callback when animation ticks
     */
    animate(onTick?: (time?: number) => void) {
        if (this.dev) {
            // start counting fps time for this frame
            this.stats && this.stats.begin();

            // TODO
            // Iterate over all dat.gui controllers and update values
            //if ((window as any)["tetsuoGui"]) {
            //    for (let i in (window as any)["tetsuoGui"].__controllers) {
            //        (window as any)["tetsuoGui"].__controllers[i].updateDisplay();
            //    }
            //}
        }

        this.clock.tick();

        // callback
        onTick && onTick(this.clock.getElapsedTime());

        this.renderer.update(this.clock.getElapsedTime());
        this.renderer.render();

        if (this.dev) {
            // finish counting fps time
            this.stats && this.stats.end();
        }

        requestAnimationFrame(() => this.animate(onTick));
    }

    /**
     * Jump clock elapsed time
     */
    jumpClock(diff: number) {
        this.clock.jump(diff);
    }
}
