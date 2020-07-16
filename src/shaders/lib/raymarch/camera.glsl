camera newCamera(vec3 origin, vec3 direction, float fov) {
    float theta = fov * PI / 180.;
    float h = tan(theta / 2.);
    float ratio = iResolution.x / iResolution.y;
    float viewport_height = 2. * h;
    float viewport_width = ratio * viewport_height;
    vec3 vup = vec3(0., 1., 0.);

    vec3 lookat = origin + direction;
    vec3 w = normalize(origin - lookat);
    vec3 u = normalize(cross(vup, w));
    vec3 v = cross(w, u);

    vec3 horizontal = viewport_width * u;
    vec3 vertical = viewport_height * v;
    vec3 lower_left_corner = origin - horizontal / 2. - vertical / 2. - w;

    return camera(origin, direction, fov, horizontal, vertical, lower_left_corner);
}

ray getRay(camera c, vec2 uv) {
    return ray(c.origin, c.lower_left_corner + uv.x * c.horizontal + uv.y * c.vertical - c.origin);
}