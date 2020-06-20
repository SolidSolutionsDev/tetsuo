let uniqueColors: string[] = [];

/**
 * Utilities for color generation and manipulation
 *
 * @category Utils
 */
export const ColorUtils = {
    /**
     * Generates a unique color hexadecimal string
     */
    uniqueColor: () => {
        let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);

        while (uniqueColors.includes(color)) {
            color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
        }

        uniqueColors.push(color);

        return color;
    },

    /**
     * Converts a hexadecimal color string to a number
     *
     * @param str - Hexadecimal color string
     */
    hexStringToNum: (str: string) => {
        return parseInt(str.replace("#", "0x"), 16);
    },
};
