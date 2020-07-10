struct mapHit {
    float dist;
    float material;
};

struct hit {
    bool didHit;
    vec3 point;
    vec3 normal;
    float dist;
    float material;
};
