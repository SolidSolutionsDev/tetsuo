#include <packing>

float readDepth(sampler2D depthSampler, vec2 coord) {
	float cameraNear = 0.1;
	float cameraFar = 50.;

	float fragCoordZ = texture2D(depthSampler, coord).x;
	float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
	return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}