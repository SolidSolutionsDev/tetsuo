void main() { 
    camera cam = getCamera();
    ray r = getRay(cam, vUv);
    hit h = castRay(r.origin, r.direction);

    gl_FragColor = h.didHit ? shade(h) : background();
}