
vec3 estimateNormal (vec3 p) {
    float EPSILON = 0.0005;
    
    return normalize(vec3(
        map(vec3(p.x + EPSILON, p.y, p.z)).dist - map(vec3(p.x - EPSILON, p.y, p.z)).dist,
        map(vec3(p.x, p.y + EPSILON, p.z)).dist - map(vec3(p.x, p.y - EPSILON, p.z)).dist,
        map(vec3(p.x, p.y, p.z  + EPSILON)).dist - map(vec3(p.x, p.y, p.z - EPSILON)).dist
    ));
}

hit castRay (vec3 origin, vec3 direction) {
    float stepSize, dist = 1.;
    mapHit h;
    
    for (int i = 0; i < 32; i++) {
        h = map(origin + direction * dist);
        stepSize = h.dist;
        dist += stepSize;

        if (stepSize < 0.01) {
            vec3 point = origin + direction * dist;
            vec3 normal = estimateNormal(point);

            return hit(true, point, normal, h.dist, h.material);
        }
    }

    return hit(false, vec3(0.), vec3(0.), 0., 0.);
}