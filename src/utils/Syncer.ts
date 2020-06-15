import { Howl } from "howler";
import { Callback } from "../types/Callback";

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

export class Syncer {
    /**
     * Audio controller of the associated music
     */
    audio: Howl;

    /**
     * Music sync options
     */
    options: SyncerOptions;

    /**
     * List of callbacks to call when music starts playing
     */
    _onPlay: Callback[] = [];

    /**
     * List of callbacks to call when music finishes playing
     */
    _onEnd: Callback[] = [];

    /**
     * List of callbacks to call when there's a beat on the music
     * This is approximated using current seek point and passed bpm value
     */
    _onBPM: Callback[] = [];

    /**
     * List of callbacks to call when music enters a custom section defined in the passed options
     */
    _onSection: { id: string; callback: Callback; done: boolean }[] = [];

    /**
     * List of callbacks to call when music seek time passes a value
     */
    _onTime: { time: number; callback: Callback; done: boolean }[] = [];

    /**
     * Last update call seek time value
     */
    _lastSeek: number = 0;

    /**
     * Time until next bpm event
     */
    _untilBPM: number = 0;

    constructor(audio: Howl, options: SyncerOptions) {
        this.audio = audio;
        this.options = options;

        this._untilBPM = (options.startDelay || 0) + 60000 / options.bpm;

        this.audio.on("end", () => this.end());
    }

    play() {
        this.audio.play();

        this._onPlay.forEach((fn) => fn());
    }

    update() {
        if (this.audio.playing()) {
            let seek = this.audio.seek();

            if (typeof seek === "number") {
                seek = seek * 1000;
                let seekDelta = seek - this._lastSeek;

                // bpm events
                let bpm = this.options.bpm;
                this._untilBPM -= seekDelta;
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

    end() {
        this._onEnd.forEach((fn) => fn());
    }

    onPlay(fn: Callback) {
        this._onPlay.push(fn);
        return this;
    }

    onEnd(fn: Callback) {
        this._onEnd.push(fn);
        return this;
    }

    onBPM(fn: Callback) {
        this._onBPM.push(fn);
        return this;
    }

    onSection(event: { id: string; callback: Callback }) {
        this._onSection.push({ ...event, done: false });
        return this;
    }

    onTime(event: { time: number; callback: Callback }) {
        this._onTime.push({ ...event, done: false });
        return this;
    }

    getUntilBPM() {
        return this._untilBPM;
    }
}
