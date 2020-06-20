/**
 * Number generation utilities
 *
 * @category Utils
 */
export const NumberUtils = {
    /**
     * Generate a random number given a seed
     *
     * @param seed
     */
    random: (seed: number) => {
        var m_w = seed || performance.now();
        var m_z = 987654321;
        var mask = 0xffffffff;
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        var result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;
        return result + 0.5;
    },

    /**
     * Generate a random number in an interval
     *
     * @param lo
     * @param hi
     */
    randomInInterval: (lo: number, hi: number) => {
        return Math.random() * (hi - lo + 1) + lo;
    },
};
