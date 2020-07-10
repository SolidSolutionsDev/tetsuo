void main() {
    vec3 rayOrigin = vec3(0., 0., 1.);
    vec2 q = (vUv.xy * iResolution.xy - .5 * iResolution.xy) / iResolution.y;
    vec3 rayDirection = normalize(vec3(q, 0.) - rayOrigin);
    hit h = castRay(rayOrigin, rayDirection);
    gl_FragColor = h.didHit ? mainColor(h) : background();
}