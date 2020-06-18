import { Callback } from "../types/Callback";

/**
 * Listener for document ready state. http://youmightnotneedjquery.com/#ready
 *
 * @param {function} fn - callback when document is ready
 */
export function ready(fn: () => void): void {
    if (document.readyState != "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

export function prepareViewport(
    options?: {
        width?: number;
        height?: number;
        backgroundColor?: string;
    },
    onPrepared?: Callback
) {
    let viewport = document.createElement("div");
    document.body.appendChild(viewport);
    viewport.setAttribute("id", "viewport");

    const style = document.createElement("style");
    style.textContent = /* css */ `
        html, body {
            background-color: ${options?.backgroundColor || "black"};
            margin: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #viewport {
            width: ${options?.width ? options.width + "px" : "100vw"};
            height: ${options?.height ? options.height + "px" : "100vh"};
        }
    `;
    document.head.append(style);

    onPrepared && onPrepared();
}

export function createStartButton(onClick?: Callback) {
    let startButton = document.createElement("div");
    startButton.setAttribute("id", "startButton");
    startButton.textContent = "start";
    startButton.onclick = () => {
        onClick && onClick();
        startButton.style.display = "none";
    };
    document.body.appendChild(startButton);

    const style = document.createElement("style");
    style.textContent = /* css */ `
        #startButton {
            position: absolute;
            background-color: #1c1c1c;
            padding: 1rem;
            font-size: 2rem;
            color: white;
            font-family: monospace;
        }

        #startButton:hover {
            background-color: #3c3c3c;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}
