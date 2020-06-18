import { Loader } from "./Loader";
import { Callback } from "../types/Callback";

export class Preloader extends Loader {
    _assets: { [key: string]: any } = {};

    _onStart: Callback[] = [];
    _onProgress: Callback[] = [];
    _onLoaded: Callback[] = [];
    _onError: Callback[] = [];

    loadManifest(manifestURL: string, callback?: Callback) {
        this._onStart.forEach((fn) => fn());

        let loaders: { [type: string]: any } = {
            music: this.loadAudio,
            object: this.loadObject,
            geometry: this.loadGeometry,
            texture: this.loadTexture,
        };

        fetch(manifestURL)
            .then((response) => response.json())
            .then((data) => {
                let keys = Object.keys(data);

                let itemsLeft = keys.length;

                let itemDone = () => {
                    itemsLeft--;
                    let percentage = (itemsLeft * 100) / keys.length;

                    this._onProgress.forEach((fn) => fn(percentage));

                    if (itemsLeft <= 0) {
                        callback && callback(this._assets);
                        this._onLoaded.forEach((fn) => fn(this._assets));
                    }
                };

                keys.forEach((key) => {
                    let manifEntry = data[key];

                    loaders[manifEntry.type] &&
                        loaders[manifEntry.type](
                            manifEntry.url,
                            (asset: any) => {
                                this._assets[key] = asset;
                                itemDone();
                            }
                        );
                });
            })
            .catch((error) => this._onError.forEach((fn) => fn(error)));
    }

    onStart(callback: Callback) {
        this._onStart.push(callback);
    }

    onProgress(callback: Callback) {
        this._onProgress.push(callback);
    }

    onLoaded(callback: Callback) {
        this._onLoaded.push(callback);
    }

    onError(callback: Callback) {
        this._onError.push(callback);
    }
}
