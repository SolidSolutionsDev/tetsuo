struct hit {
    bool didHit;
    vec3 point;
    vec3 normal;
    float dist;
    float material;
};

vec3 estimateNormal (vec3 p) {
    float EPSILON = 0.0005;
    
    return normalize(vec3(
        map(vec3(p.x + EPSILON, p.y, p.z)) - map(vec3(p.x - EPSILON, p.y, p.z)),
        map(vec3(p.x, p.y + EPSILON, p.z)) - map(vec3(p.x, p.y - EPSILON, p.z)),
        map(vec3(p.x, p.y, p.z  + EPSILON)) - map(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

hit castRay (vec3 origin, vec3 direction) {
    float stepSize, dist = 1.;
    
    for (int i = 0; i < 32; i++) {
        stepSize = map(origin + direction * dist);
        dist += stepSize;

        if (stepSize < 0.01) {
            vec3 point = origin + direction * dist;
            vec3 normal = estimateNormal(point);

            return hit(true, point, normal, dist, 0.);
        }
    }

    return hit(false, vec3(0.), vec3(0.), 0., 0.);
}