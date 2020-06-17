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

export function random(seed: number) {
    var m_w = seed || performance.now();
    var m_z = 987654321;
    var mask = 0xffffffff;
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
}

let uniqueColors: string[] = [];

export function uniqueColor() {
    let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);

    while (uniqueColors.includes(color)) {
        color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    }

    uniqueColors.push(color);

    return color;
}

export function hexStringToNum(str: string) {
    return parseInt(str.replace("#", "0x"), 16);
}

export function randomInInterval(lo: number, hi: number) {
    return Math.random() * (hi - lo + 1) + lo;
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
