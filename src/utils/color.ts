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
