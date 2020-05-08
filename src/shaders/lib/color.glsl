vec4 anaglyph(sampler2D tex, vec2 p, float k) {
    return vec4(
        texture2D(tex, vec2(p.x - k, p.y)).r, 
        texture2D(tex, p).g, 
        texture2D(tex,  vec2(p.x + k, p.y)).b,
        1.
    );
}