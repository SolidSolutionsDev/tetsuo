mat3 rotX (float angle) {
    return mat3(
        vec3(1., 0., 0.),
        vec3(0., cos(angle), -sin(angle)),
        vec3(0., sin(angle), cos(angle))
    );
}

mat3 rotY (float angle) {
    return mat3(
        vec3(cos(angle), 0., sin(angle)),
        vec3(0., 1., 0.),
        vec3(-sin(angle), 0., cos(angle))
    );
}

mat3 rotZ (float angle) {
    return mat3(
        vec3(cos(angle), -sin(angle), 0.),
        vec3(sin(angle), cos(angle), 0.),
        vec3(0., 0., 1.)
    );
}