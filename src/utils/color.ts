let uniqueColors: string[] = [];

/**
 * Generates a unique color hexadecimal string
 */
export const uniqueColor = () => {
    let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);

    while (uniqueColors.includes(color)) {
        color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
    }

    uniqueColors.push(color);

    return color;
};

/**
 * Converts a hexadecimal color string to a number
 *
 * @param str - Hexadecimal color string
 */
export const hexStringToNum = (str: string) => {
    return parseInt(str.replace("#", "0x"), 16);
};
