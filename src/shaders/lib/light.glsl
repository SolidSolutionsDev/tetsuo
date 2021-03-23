vec3 diffuseLight (vec3 lightPosition, vec3 lightColor, vec3 point, vec3 normal) {
    vec3 lightDirection = normalize(lightPosition - point);
    float diff = max(dot(normal, lightDirection), 0.01); 
    return lightColor * diff;
}

vec3 fog (vec3 rgb, float d, vec3 fogColor) {
    float fogAmount = .5 - exp( -d * 0.03) * 1.;
    return mix(rgb, fogColor, fogAmount);
}
