#include <packing>

float readDepth(sampler2D depthSampler, vec2 coord, float cameraNear, float cameraFar) {
	float fragCoordZ = texture2D(depthSampler, coord).x;
	float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
	return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}