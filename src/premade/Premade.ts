export type PremadeMeshTypes = THREE.Mesh | THREE.Group;

export interface Premade {
    mesh?: PremadeMeshTypes;
    getMesh?: () => PremadeMeshTypes;

    texture?: THREE.Texture;
    getTexture?: () => THREE.Texture;

    prepare: (options: any) => Promise<any>;
    update: (time: number, updateOptions?: any) => void;
}
