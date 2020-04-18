float rand (float seed) {
    return .1 + fract(sin(seed) * 2048.);
}

float randSignal (float seed){
    float r = rand(seed);

    if (r > .5) {
        return 1.;
    } else {
        return -1.;
    }
}