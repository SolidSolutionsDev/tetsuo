
float sdSphere (vec3 point, vec3 position, float radius) {
    return distance(point, position) - radius;
}

float sdBox (vec3 point, vec3 position, vec3 b) {
  vec3 q = abs(point - position) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdCylinder (vec3 point, vec3 c) {
  return length(point.xz - c.xy) - c.z;
}

float opSmoothUnion (float distance1, float distance2, float amount) {
    float h = clamp(0.5 + 0.5 * (distance2 - distance1) / amount, 0., 1.);
    return mix(distance2, distance1, h) - amount * h * (1. - h); 
}