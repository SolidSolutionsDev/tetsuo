import { Callback } from "../types/Callback";

/**
 * Utilities related with listening and manipulating the DOM
 *
 * @category Utils
 */
export const PageUtils = {
    /**
     * Listener for document ready state. http://youmightnotneedjquery.com/#ready
     *
     * @param fn - callback when document is ready
     */
    ready: (fn: () => void): void => {
        if (document.readyState != "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    },

    /**
     * Creates a viewport element in an empty page and sets up its style
     *
     * @param options - Configuration options
     * @param onPrepared - Callback when viewport is prepared
     */
    prepareViewport: (
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
    },

    /**
     * Creates a start button centered on top of the page and calls back when button is clicked.
     * The button will hide automatically.
     *
     * @param onClicked - Callback when button is clicked
     */
    createStartButton: (onClick?: Callback) => {
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
    },

    getGUI: () => (window as any)["TETSUO"]?.gui,
};
