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

struct camera {
    vec3 origin;
    vec3 direction;
    float fov;
    vec3 horizontal;
    vec3 vertical;
    vec3 lower_left_corner;
};

struct ray {
    vec3 origin;
    vec3 direction;
};