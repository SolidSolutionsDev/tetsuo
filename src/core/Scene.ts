import Stats from "stats.js";
import { Clock } from "./Clock";
import { NodeRenderer } from "../nodes/NodeRenderer";
import { Node } from "../nodes/Node";
import dat from "dat.gui";
import { THREENode } from "../nodes/THREENode";

/**
 * Scene initialization options
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
 * Scene wrapper
 */
export class Scene {
    /**
     * Clock for animating
     */
    clock: Clock;

    /**
     * Node renderer
     */
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

    /**
     * dat.gui UI
     */
    gui: dat.GUI | null = null;

    constructor({ dev, autoStart, viewportElement }: SceneOptions) {
        // initialize renderer
        this.renderer = new NodeRenderer({
            viewportElement,
        });

        // initialize the clock
        this.clock = new Clock();

        // dev utils initialization
        this.dev = !!dev;
        if (this.dev) {
            // instantiate dat.gui UI
            this.gui = new dat.GUI();
            // add it to the global context for easy access
            (window as any).TETSUO.gui = this.gui;

            // add a stats element to the viewport for tracking fps
            this.stats = new Stats();
            this.renderer.viewport && this.renderer.viewport.domElement.appendChild(this.stats.dom);
        }

        // if autoStart variable is true, start animating the scene right away
        autoStart && this.animate();
    }

    /**
     * Animate method.
     * Renders the scene, updates uniforms, updates dev utils, etc
     *
     * @param onTick - Callback when animation ticks
     */
    animate(onTick?: (totalTime?: number, deltaTime?: number) => void) {
        if (this.dev) {
            // start counting fps time for this frame
            this.stats && this.stats.begin();

            // Iterate over all dat.gui controllers and update values
            if (this.gui) {
                for (let i in this.gui.__controllers) {
                    this.gui.__controllers[i].updateDisplay();
                }
            }
        }

        // move clock along
        let delta = this.clock.tick();

        // callback
        onTick && onTick(this.clock.getElapsedTime(), delta);

        // update all nodes in the render
        this.renderer.update(this.clock.getElapsedTime(), delta);

        // render all nodes
        this.renderer.render();

        if (this.dev) {
            // finish counting fps time
            this.stats && this.stats.end();
        }

        requestAnimationFrame(() => this.animate(onTick));
    }

    /**
     * Creates a basic scene for three.js.
     */
    basic(): { scene: Scene; node: Node } {
        let node = new THREENode("node", this.renderer);

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
