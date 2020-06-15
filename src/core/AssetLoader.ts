import Loader from "./Loader";

let assets: { [key: string]: any } = {};

const AssetLoader = {
    preloadAssets: (manifestURL: string): Promise<any> =>
        new Promise((resolve, reject) => {
            fetch(manifestURL)
                .then((response) => response.json())
                .then((data) => {
                    Object.keys(data).forEach((key) => {
                        if (data[key].url.endsWith("mp3")) {
                            assets[key] = Loader.loadAudio(data[key].url);
                        }
                    });

                    resolve(assets);
                })
                .catch((error) => reject(error));
        }),
};

export default {
    ...AssetLoader,
    assets,
};
