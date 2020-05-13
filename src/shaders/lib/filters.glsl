vec4 anaglyph(sampler2D tex, vec2 p, float k) {
    return vec4(
        texture2D(tex, vec2(p.x - k, p.y)).r, 
        texture2D(tex, p).g, 
        texture2D(tex,  vec2(p.x + k, p.y)).b,
        1.
    );
}

vec4 boxblur(sampler2D tex, vec2 texSize, vec2 p, float separation) {
    vec4 result = vec4(0.);

    for (float i = -2.; i <= 2.; i++) {
        for (float j = -2.; j <= 2.; j++) {
            result.rgb += texture2D(tex, (p * texSize + vec2(i, j) * separation) / texSize).rgb;
        }
    }

    result.rgb /= 25.;
    result.a = 1.;

    return result;
}


vec4 bloom(sampler2D tex, vec2 texSize, vec2 p, float separation, float threshold, float amount) {
    vec4 result = vec4(0.);

    for (float i = -2.; i <= 2.; i++) {
        for (float j = -2.; j <= 2.; j++) {
            vec4 color = vec4(0.);
            vec4 t = texture2D(tex, (p * texSize + vec2(i, j) * separation) / texSize);
            float g = max(t.r, max(t.g, t.b));

            if (g > threshold) {
                color = t;
            }

            result.rgb += color.rgb;
        }
    }

    result.rgb /=  25.;
    result.a = 1.;

    return texture2D(tex, p) + result * amount;
}
