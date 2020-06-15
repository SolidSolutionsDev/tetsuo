import Loader from "./Loader";

let assets: { [key: string]: any } = {};

const Preloader = {
    loadManifest: (
        manifestURL: string,
        callback: (assets: any) => any
    ): Promise<any> =>
        fetch(manifestURL)
            .then((response) => response.json())
            .then((data) => {
                let itemCount = Object.keys(data).length;

                function itemDone() {
                    itemCount--;
                    if (itemCount <= 0) {
                        callback(assets);
                    }
                }

                Object.keys(data).forEach((key) => {
                    if (data[key].url.endsWith("mp3")) {
                        Loader.loadAudio(data[key].url).then((audio) => {
                            assets[key] = audio;
                            itemDone();
                        });
                    } else if (data[key].url.endsWith("png")) {
                        assets[key] = Loader.loadTexture(data[key].url);
                        itemDone();
                    } else if (data[key].url.endsWith(".geo.json")) {
                        Loader.loadGeometry(data[key].url, (geo) => {
                            assets[key] = geo;
                            itemDone();
                        });
                    }
                });
            })
            .catch((error) => callback(error)),

    getAssetById: (id: string) => assets[id],
};

export default {
    ...Preloader,
    assets,
};
