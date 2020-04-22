/**
 * Clock class to control time.
 * Inspired by THREE.Clock but with different operation.
 * Uses performance.now if available, Date() otherwise
 */
export declare class Clock {
    /**
     * Clock's start time
     */
    startTime: number;
    /**
     * Previous frame elapsed time since starting clock
     */
    prevTime: number;
    /**
     * Total elapsed time since starting clock
     */
    elapsedTime: number;
    /**
     * Whether the clock is running
     */
    running: boolean;
    constructor(autoStart?: boolean);
    /**
     * Starts the clock
     */
    start(): void;
    /**
     * Pauses/unpauses the clock
     */
    pause(): void;
    /**
     * Stops the clock
     */
    stop(): void;
    /**
     * Changes elapsed time on the clock to a value
     *
     * @param time
     */
    setTime(time: number): void;
    /**
     * Jumps the clock elapsed time. Value can be negative to go back in time
     *
     * @param diff
     */
    jump(diff: number): void;
    /**
     * Retrieves elapsed time on the clock
     */
    getElapsedTime(): number;
    /**
     * Moves the clock along
     */
    tick(): number;
}
//# sourceMappingURL=Clock.d.ts.map