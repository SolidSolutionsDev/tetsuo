void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    vec2 uv = fragCoord/iResolution.xy;

    camera cam = getCamera();
    ray r = getRay(cam, uv);
    hit h = castRay(r.origin, r.direction);

    fragColor = h.didHit ? shade(h, uv) : background(uv);
}