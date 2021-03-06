import { Callback } from "../types/Callback";

/**
 * Clock class to control time and looping.
 *
 * Inspired by THREE.Clock but with different operation.
 * Uses performance.now if available, Date() otherwise
 *
 * @category Core
 */
export class Clock {
    /**
     * Clock's start time
     */
    startTime: number = 0;

    /**
     * Previous frame elapsed time since starting clock
     */
    prevTime: number = 0;

    /**
     * Total elapsed time since starting clock
     */
    elapsedTime: number = 0;

    /**
     * Number of frames since clock started running
     */
    frameCount: number = 0;

    /**
     * Whether the clock is running
     */
    running: boolean = false;

    /**
     * Callback when clock ticks
     */
    private onTick?: Callback;

    /**
     * @param autoStart - Whether to autostart the clock loop
     * @param onTick - Callback when clock ticks
     */
    constructor(autoStart: boolean = true, onTick?: Callback) {
        this.onTick = onTick;
        autoStart && this.start();
    }

    /**
     * Starts the clock
     */
    start() {
        this.running = true;
        this.elapsedTime = 0;
        this.frameCount = 0;
        this.startTime = (typeof performance === "undefined"
            ? Date
            : performance
        ).now();

        this.tick();
    }

    /**
     * Pauses/unpauses the clock
     */
    pause() {
        this.prevTime = (typeof performance === "undefined"
            ? Date
            : performance
        ).now();
        this.running = !this.running;
    }

    /**
     * Stops the clock
     */
    stop() {
        this.elapsedTime = 0;
        this.running = false;
    }

    /**
     * Changes elapsed time on the clock to a value
     *
     * @param time
     */
    setTime(time: number) {
        this.prevTime = time;
        this.elapsedTime = time;
    }

    /**
     * Jumps the clock elapsed time. Value can be negative to go back in time
     *
     * @param diff
     */
    jump(diff: number) {
        this.elapsedTime += diff;
    }

    /**
     * Retrieves elapsed time on the clock
     */
    getElapsedTime() {
        return this.elapsedTime;
    }

    /**
     * Moves the clock along
     */
    private tick() {
        let diff = 0;

        if (this.running) {
            var newTime = (typeof performance === "undefined"
                ? Date
                : performance
            ).now();

            diff = (newTime - this.prevTime) / 1000;
            this.prevTime = newTime;

            this.elapsedTime += diff;
            this.frameCount += 1;

            this.onTick && this.onTick(this.elapsedTime, diff, this.frameCount);

            requestAnimationFrame(this.tick.bind(this));
        }
    }
}
