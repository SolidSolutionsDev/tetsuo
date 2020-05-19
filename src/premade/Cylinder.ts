import * as THREE from "three";
import { PremadeMesh } from "./PremadeMesh";

export interface CylinderOptions {
    /**
     * Number of slices in the cylinder
     */
    sliceCount?: number;

    /**
     * Height of each slice
     */
    sliceHeight?: number;

    /**
     * Spacing between slices
     */
    sliceSpacing?: number;

    /**
     * Number of radius segments in the slice mesh
     */
    sliceSegments?: number;

    /**
     * Number of particles to create
     */
    particleCount?: number;
}

export interface CylinderUpdateOptions {
    /**
     * Amount of rotation to add to the slices
     */
    sliceRotationAmount?: number;

    /**
     * Amount of rotation to add to the particles
     */
    particleRotationAmount?: number;
}

export class Cylinder implements PremadeMesh {
    /**
     * Output mesh for external use
     */
    mesh: THREE.Group;

    /**
     * Number of slices in the cylinder
     */
    sliceCount: number;

    /**
     * Height of each slice
     */
    sliceHeight: number;

    /**
     * Spacing between slices
     */
    sliceSpacing: number;

    /**
     * Number of radius segments in the slice mesh
     */
    sliceSegments: number;

    /**
     * Number of particles to create
     */
    particleCount: number;

    /**
     * Slices that compose the cylinder
     */
    slices: THREE.Mesh[] = [];

    /**
     * State for the particles of the cylinder
     */
    particles: { position: THREE.Vector3 }[] = [];

    /**
     * Point mesh of the particles
     */
    particleMesh?: THREE.Points;

    constructor(options?: CylinderOptions) {
        this.sliceCount = options?.sliceCount || 25;
        this.sliceHeight = options?.sliceHeight || 0.1;
        this.sliceSpacing = options?.sliceSpacing || this.sliceHeight / 2;
        this.sliceSegments = options?.sliceSegments || 5;
        this.particleCount = options?.particleCount || 300;

        this.mesh = new THREE.Group();
    }

    /**
     * Builds the mesh
     */
    prepare() {
        return new Promise<THREE.Group>((resolve, reject) => {
            // create slices
            let geo = new THREE.CylinderGeometry(1, 1, this.sliceHeight, this.sliceSegments);
            let material = new THREE.MeshNormalMaterial();
            for (let i = 0; i < this.sliceCount; i++) {
                let slice = new THREE.Mesh(geo, material);
                slice.position.y = i * (this.sliceHeight + this.sliceSpacing);
                slice.rotation.y = i / 20;
                this.slices.push(slice);
                this.mesh.add(slice);
            }

            // create particles
            let particleGeo = new THREE.Geometry();
            for (let i = 0; i < this.particleCount; i++) {
                let particle = {
                    position: new THREE.Vector3(
                        Math.random() * 4 - 2,
                        Math.random() * 3.5,
                        Math.random() * 4 - 2
                    ),
                };
                particleGeo.vertices.push(particle.position);
                this.particles.push(particle);
            }
            let particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
            this.particleMesh = new THREE.Points(particleGeo, particleMaterial);
            this.mesh.add(this.particleMesh);

            resolve(this.mesh);
        });
    }

    /**
     * Updates the mesh
     *
     * @param time - Current animation time
     * @param updateOptions - Update options to override defaults
     */
    update(time: number, updateOptions?: CylinderUpdateOptions) {
        this.slices.forEach(
            (slice, index) =>
                (slice.rotation.y = index / 20 + time * (updateOptions?.sliceRotationAmount || 0.5))
        );

        if (this.particleMesh)
            this.particleMesh.rotation.y = time * (updateOptions?.particleRotationAmount || -0.5);
    }

    /**
     * Retrieves the output mesh for external use
     */
    getMesh() {
        return this.mesh;
    }
}
