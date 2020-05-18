export interface PremadeMesh {
    mesh?: THREE.Mesh | THREE.Group;
    prepare: (options: any) => void;
    update: (time: number, updateOptions?: any) => void;
    getMesh: () => THREE.Mesh | THREE.Group;
}
