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

/**
 * Random function
 * taken from ninjadev's nin
 */
export function Random(seed: number) {
    var m_w = seed || 123456791;
    var m_z = 987654321;
    var mask = 0xffffffff;

    return function random() {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        var result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;
        return result + 0.5;
    };
}

/**
 * Interpolation functions
 * taken from ninjadev's nin
 */
export function lerp(a: number, b: number, t: number) {
    t = clamp(0, t, 1);
    return b * t + a * (1 - t);
}

export function clamp(a: number, v: number, b: number) {
    return Math.min(b, Math.max(v, a));
}

export function smoothstep(a: number, b: number, t: number) {
    t = clamp(0, t, 1);
    var v = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
    return b * v + a * (1 - v);
}

export function easeIn(a: number, b: number, t: number) {
    return lerp(a, b, t * t * t);
}

export function easeOut(a: number, b: number, t: number) {
    t = --t * t * t + 1;
    return lerp(a, b, t);
}

export function elasticOut(b: number, c: number, d: number, t: number) {
    t = clamp(0, t, 1);
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (33 * tc * ts + -106 * ts * ts + 126 * tc + -67 * ts + 15 * t);
}
