float remap(float v, float l0, float h0, float l1, float h1) {
    return l1 + ((v - l0) - (h1 - l1)/ h0 - l0);
}

float sat(float v) {
    return v < 0.5 ? 0. : 1.;
}

float sat(float v, float cutoff, float lo, float hi) {
    return v < cutoff ? lo : hi;
}