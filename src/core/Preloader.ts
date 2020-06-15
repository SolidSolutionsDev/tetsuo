import Loader from "./Loader";

let assets: { [key: string]: any } = {};

const Preloader = {
    loadManifest: (manifestURL: string): Promise<any> =>
        new Promise((resolve, reject) => {
            fetch(manifestURL)
                .then((response) => response.json())
                .then((data) => {
                    let itemCount = Object.keys(data).length;

                    function itemDone() {
                        itemCount--;
                        if (itemCount <= 0) {
                            resolve(assets);
                        }
                    }

                    Object.keys(data).forEach((key) => {
                        if (data[key].url.endsWith("mp3")) {
                            Loader.loadAudio(data[key].url).then((audio) => {
                                assets[key] = audio;
                                itemDone();
                            });
                        }
                    });
                })
                .catch((error) => reject(error));
        }),

    getAssetById: (id: string) => assets[id],
};

export default {
    ...Preloader,
    assets,
};
