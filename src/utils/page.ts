import { Callback } from "../types/Callback";

/**
 * Listener for document ready state. http://youmightnotneedjquery.com/#ready
 *
 * @param fn - callback when document is ready
 */
export const ready = (fn: () => void): void => {
    if (document.readyState != "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
};

/**
 * Creates a viewport element in an empty page and sets up its style
 *
 * @param options - Configuration options
 * @param onPrepared - Callback when viewport is prepared
 */
export const prepareViewport = (
    options?: {
        width?: number;
        height?: number;
        backgroundColor?: string;
        border?: boolean;
        borderColor?: string;
    },
    onPrepared?: Callback
) => {
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
                border: ${
                    options?.border ? "1px solid " + options?.borderColor : "0"
                }
            }
        `;
    document.head.append(style);

    onPrepared && onPrepared(viewport);

    return viewport;
};

/**
 * Creates a start button centered on top of the page and calls back when button is clicked.
 * The button will hide automatically.
 *
 * @param onClicked - Callback when button is clicked
 * @param extraOptions - Extra options
 */
export const createStartButton = (
    onClick?: Callback,
    extraOptions?: { label?: string; sublabel?: string }
) => {
    let container = document.createElement("div");
    container.setAttribute("id", "startContainer");
    document.body.appendChild(container);

    if (extraOptions?.label) {
        let label = document.createElement("div");
        label.setAttribute("id", "startLabel");
        label.textContent = extraOptions.label;
        container.appendChild(label);
    }

    if (extraOptions?.sublabel) {
        let sublabel = document.createElement("div");
        sublabel.setAttribute("id", "startSublabel");
        sublabel.textContent = extraOptions.sublabel;
        container.appendChild(sublabel);
    }

    let startButton = document.createElement("div");
    startButton.setAttribute("id", "startButton");
    startButton.textContent = "start";
    startButton.onclick = () => {
        onClick && onClick();
        container.style.display = "none";
    };
    container.appendChild(startButton);

    const style = document.createElement("style");
    style.textContent = /* css */ `
            body {
                background: black;
            }

            #startContainer {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                text-align: center;
                background: black;
                padding: 2rem;
                
                font-family: monospace;
                font-size: 2rem;

                color: white;
            }

            #startLabel {
                font-weight: bold;
            }

            #startSublabel {
                font-size: 1rem;
            }
    
            #startButton {
                background-color: #1c1c1c;
                padding: 1rem;
                margin-top: 2rem;
                color: white;
            }
    
            #startButton:hover {
                background-color: #3c3c3c;
                cursor: pointer;
            }
        `;
    document.head.appendChild(style);
};

export const getGUI = () => (window as any)["TETSUO"]?.gui;
export const getNodeCache = () => {
    if ((window as any)["TETSUO"] && !(window as any)["TETSUO"].nodes) {
        (window as any)["TETSUO"].nodes = [];
    }

    return (window as any)["TETSUO"]?.nodes;
};
