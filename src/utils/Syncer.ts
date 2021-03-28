import { Howl } from "howler";
import { Callback } from "../types/Callback";

/**
 * Syncer initialization options
 *
 * @category Utils
 */
export interface SyncerOptions {
    /**
     * BPM of the associated music track
     */
    bpm: number;

    /**
     * Start delay until the first beat of the music
     * Allows to skip non-rhythmic intros that don't match the music's BPM
     */
    startDelay?: number;

    /**
     * Custom sections of the music for triggering events
     */
    sections?: { id: string; time: number }[];
}

/**
 * Class for synchronizing code with a music playback
 *
 * @category Utils
 */
export class Syncer {
    /**
     * Audio controller of the associated music
     */
    audio: Howl;

    /**
     * Music sync options
     */
    private options: SyncerOptions;

    /**
     * List of callbacks to call when music starts playing
     */
    private _onPlay: Callback[] = [];

    /**
     * List of callbacks to call when syncer updates
     */
    private _onUpdate: Callback[] = [];

    /**
     * List of callbacks to call when music finishes playing
     */
    private _onEnd: Callback[] = [];

    /**
     * List of callbacks to call when there's a beat on the music
     * This is approximated using current seek point and passed bpm value
     */
    private _onBPM: Callback[] = [];

    /**
     * List of callbacks to call when music enters a custom section defined in the passed options
     */
    private _onSection: {
        id: string;
        callback: Callback;
        done: boolean;
    }[] = [];

    /**
     * List of callbacks to call when music seek time passes a value
     */
    private _onTime: { time: number; callback: Callback; done: boolean }[] = [];

    /**
     * Last update call seek time value
     */
    private _lastSeek: number = 0;

    /**
     * Time until next bpm event
     */
    private _untilBPM: number = 0;

    constructor(audio: Howl, options: SyncerOptions) {
        this.audio = audio;
        this.options = options;

        // convert BPM to ms and add start delay
        this._untilBPM = (options.startDelay || 0) + 60000 / options.bpm;

        // listen to audio playback end and trigger end events
        this.audio.on("end", () => this._onEnd.forEach((fn) => fn()));
    }

    /**
     * Starts audio playback
     */
    play() {
        this.audio.play();

        // trigger audio playback start events
        this._onPlay.forEach((fn) => fn());
    }

    /**
     * Updates the internal counters and triggers events according to current playback position
     */
    update() {
        if (this.audio.playing()) {
            // get current playback position
            let seek = this.audio.seek();

            // howler problem: seek() calls sometimes return something other than a number
            if (typeof seek === "number") {
                // convert from seconds to ms
                seek = seek * 1000;
                // difference between last update() playback position and current position
                let seekDelta = seek - this._lastSeek;

                let bpm = this.options.bpm;
                let currBeat = (seek * bpm) / 60000;
                this._onUpdate.forEach((fn) => fn(currBeat));

                // update time until next BPM event counter
                this._untilBPM -= seekDelta;

                // if a BPM time has been passed, trigger BPM events
                // and calculate next BPM time
                if (this._untilBPM < 0) {
                    this._onBPM.forEach((fn) => fn());
                    this._untilBPM = 60000 / bpm + this._untilBPM;
                }

                // section events
                this.options.sections &&
                    this.options.sections.forEach((section) => {
                        section.time -= seekDelta;

                        if (section.time < 0) {
                            this._onSection.forEach((event) => {
                                if (event.id === section.id && !event.done) {
                                    event.callback();
                                    event.done = true;
                                }
                            });
                        }
                    });

                // time events
                this._onTime.forEach((event) => {
                    event.time -= seekDelta;
                    if (event.time < 0 && !event.done) {
                        event.callback();
                        event.done = true;
                    }
                });

                this._lastSeek = seek;
            }
        }
    }

    /**
     * Add a new playback start event listener
     *
     * @param fn
     */
    onPlay(fn: Callback) {
        this._onPlay.push(fn);
        return this;
    }

    /**
     * Add a new playback end event listener
     *
     * @param fn
     */
    onEnd(fn: Callback) {
        this._onEnd.push(fn);
        return this;
    }

    /**
     * Add a new update event listener
     *
     * @param fn
     */
    onUpdate(fn: Callback) {
        this._onUpdate.push(fn);
        return this;
    }

    /**
     * Add a new event listener to trigger at every music beat
     * This is calculated using the BPM option of the syncer
     *
     * @param fn
     */
    onBPM(fn: Callback) {
        this._onBPM.push(fn);
        return this;
    }

    /**
     * Add a new event listener to trigger at a section with a given id
     *
     * @param fn
     */
    onSection(event: { id: string; callback: Callback }) {
        this._onSection.push({ ...event, done: false });
        return this;
    }

    /**
     * Add a new event listener to trigger when playback reaches a given time
     *
     * @param fn
     */
    onTime(event: { time: number; callback: Callback }) {
        this._onTime.push({ ...event, done: false });
        return this;
    }

    /**
     * Get time left until the next music beat
     *
     * @param fn
     */
    getUntilBPM() {
        return this._untilBPM;
    }
}
