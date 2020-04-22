/**
 * Listener for document ready state. http://youmightnotneedjquery.com/#ready
 *
 * @param {function} fn - callback when document is ready
 */
export declare function ready(fn: () => void): void;
/**
 * Random function
 * taken from ninjadev's nin
 */
export declare function Random(seed: number): () => number;
/**
 * Interpolation functions
 * taken from ninjadev's nin
 */
export declare function lerp(a: number, b: number, t: number): number;
export declare function clamp(a: number, v: number, b: number): number;
export declare function smoothstep(a: number, b: number, t: number): number;
export declare function easeIn(a: number, b: number, t: number): number;
export declare function easeOut(a: number, b: number, t: number): number;
export declare function elasticOut(b: number, c: number, d: number, t: number): number;
//# sourceMappingURL=utils.d.ts.map