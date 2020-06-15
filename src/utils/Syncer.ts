import { Howl } from "howler";
import { Callback } from "../types/Callback";

export interface SyncerOptions {
    bpm: number;
    startDelay?: number;
    sections?: { id: string; time: number }[];
}

export class Syncer {
    audio: Howl;
    options: SyncerOptions;

    _onPlay: Callback[] = [];
    _onEnd: Callback[] = [];

    _onBPM: Callback[] = [];

    _onSection: { id: string; callback: Callback; done: boolean }[] = [];
    _onTime: { time: number; callback: Callback; done: boolean }[] = [];

    _lastSeek: number = 0;
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
}
