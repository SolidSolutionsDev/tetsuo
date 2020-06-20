import { Loader } from "./Loader";
import { Callback } from "../types/Callback";

/**
 * Utility to preload assets and trigger relevant callbacks
 *
 * @category Core
 */
export class Preloader extends Loader {
    /**
     * List of loaded assets
     */
    private _assets: { [key: string]: any } = {};

    /**
     * List of callbacks to be called when a loading procedure starts
     */
    private _onStart: Callback[] = [];

    /**
     * List of callbacks to be called when a loading procedure progresses
     */
    private _onProgress: Callback[] = [];

    /**
     * List of callbacks to be called when a loading procedure ends
     */
    private _onLoaded: Callback[] = [];

    /**
     * List of callbacks to be called when an error occurs
     */
    private _onError: Callback[] = [];

    /**
     * Loads the resources described in a manifest JSON file at a given URL
     *
     * @param manifestURL - URL of the manifest file
     * @param callback - Callback when loading finishes
     */
    loadManifest(manifestURL: string, callback?: Callback) {
        // trigger load start callbacks
        this._onStart.forEach((fn) => fn());

        // list of loaders for each resource type
        let loaders: { [type: string]: any } = {
            music: this.loadAudio,
            object: this.loadObject,
            geometry: this.loadGeometry,
            texture: this.loadTexture,
        };

        // download manifest file
        fetch(manifestURL)
            .then((response) => response.json())
            .then((data) => {
                let keys = Object.keys(data);

                let itemsLeft = keys.length;

                // called everytime a resource loads
                let itemDone = () => {
                    // calculate new percentage and trigger progress events
                    let percentage = (itemsLeft * 100) / keys.length;
                    this._onProgress.forEach((fn) => fn(percentage));

                    // count resource as loaded
                    itemsLeft--;

                    // if all the resources have been loaded
                    // callback and trigger loaded events
                    if (itemsLeft <= 0) {
                        callback && callback(this._assets);
                        this._onLoaded.forEach((fn) => fn(this._assets));
                    }
                };

                keys.forEach((key) => {
                    let manifEntry = data[key];

                    // load resource according to its type
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

    /**
     * Adds an event listener for when a loading procedure starts
     *
     * @param callback
     */
    onStart(callback: Callback) {
        this._onStart.push(callback);
    }

    /**
     * Adds an event listener for when a loading procedure progresses
     *
     * @param callback
     */
    onProgress(callback: Callback) {
        this._onProgress.push(callback);
    }

    /**
     * Adds an event listener for when a loading procedure finishes
     *
     * @param callback
     */
    onLoaded(callback: Callback) {
        this._onLoaded.push(callback);
    }

    /**
     * Adds an event listener for when an error occurs
     *
     * @param callback
     */
    onError(callback: Callback) {
        this._onError.push(callback);
    }
}
