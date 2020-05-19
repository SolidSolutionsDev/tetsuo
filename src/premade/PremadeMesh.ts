export type PremadeMeshTypes = THREE.Mesh | THREE.Group;

export interface PremadeMesh {
    mesh?: PremadeMeshTypes;
    prepare: (options: any) => Promise<PremadeMeshTypes>;
    update: (time: number, updateOptions?: any) => void;
    getMesh: () => PremadeMeshTypes;
}
