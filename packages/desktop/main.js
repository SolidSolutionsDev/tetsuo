const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

let scriptLocation;
let filesToWatch = [path.resolve("../core/dist/**/*")];
let win;

yargs(hideBin(process.argv))
    .command(
        "run <script>",
        "run script",
        (yargs) => {
            yargs.positional("run", {
                describe: "script to run",
                type: "string",
            });
        },
        run
    )
    .demandCommand()
    .help().argv;

function run({ script }) {
    scriptLocation = path.resolve(process.cwd(), "..", script);

    console.log("running", scriptLocation);

    filesToWatch.push(scriptLocation);

    app.whenReady().then(() => {
        console.log("ready");
        createWindow();
    });

    app.on("window-all-closed", () => {
        console.log("all closed");
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        console.log("activate");

        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}

function loadScript() {
    console.log("loading script");

    let js = fs.readFileSync(scriptLocation, "utf-8");
    win.webContents.executeJavaScript(js);
}

function watchFiles() {
    console.log("watching files");

    const watcher = chokidar.watch(filesToWatch);

    watcher.on("change", () => {
        console.log("file changed");
        win.reload();
    });
}

function createWindow() {
    win = new BrowserWindow({
        title: "tetsuo",
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile("index.html");
    win.maximize();
    win.webContents.openDevTools();

    watchFiles();

    win.webContents.on("dom-ready", function (e) {
        loadScript();
    });
}
