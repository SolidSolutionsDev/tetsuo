import Stats from "stats.js";
import { Clock } from "./Clock";
import { NodeRenderer } from "./nodes/NodeRenderer";
import { Node } from "./nodes/Node";
import dat from "dat.gui";
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
export declare class Scene {
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
    stats: Stats | null;
    /**
     * Whether this scene is in development mode (dat.gui, stats)
     */
    dev: boolean;
    /**
     * Whether to start the animation loop automatically when the scene is created.
     */
    autoStart: boolean;
    /**
     * dat.gui UI
     */
    gui: dat.GUI | null;
    constructor({ dev, autoStart, viewportElement }: SceneOptions);
    /**
     * Animate method.
     * Renders the scene, updates uniforms, updates dev utils, etc
     *
     * @param onTick - Callback when animation ticks
     */
    animate(onTick?: (time?: number) => void): void;
    /**
     * Creates a basic scene for three.js.
     */
    basic(): {
        scene: Scene;
        node: Node;
    };
    connectToScreen(node: Node): void;
    /**
     * Jump clock elapsed time
     */
    jumpClock(diff: number): void;
}
//# sourceMappingURL=Scene.d.ts.map