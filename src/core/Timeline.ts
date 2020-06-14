import { Clock } from "./Clock";
import { Callback } from "../types/Callback";

export interface TimelineOptions {
    autoStart: boolean;

    onStart?: Callback;
    onUpdate?: Callback;
    onPause?: Callback;
    onStop?: Callback;
}

export class Timeline {
    clock: Clock;

    onStart: Callback[] = [];
    onUpdate: Callback[] = [];
    onPause: Callback[] = [];
    onStop: Callback[] = [];

    constructor(options?: TimelineOptions) {
        this.clock = new Clock(options?.autoStart);

        options?.onStart && this.onStart.push(options.onStart);
        options?.onUpdate && this.onUpdate.push(options.onUpdate);
        options?.onPause && this.onPause.push(options.onPause);
        options?.onStop && this.onStop.push(options.onStop);
    }

    start() {
        this.clock.start();

        this.onStart.forEach((fn) => fn());
    }

    pause() {
        this.clock.pause();

        this.onPause.forEach((fn) => fn());
    }

    stop() {
        this.clock.stop();

        this.onStop.forEach((fn) => fn());
    }
}
