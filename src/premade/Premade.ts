export type PremadeMeshTypes = THREE.Mesh | THREE.Group;

export interface Premade {
    mesh?: PremadeMeshTypes;
    getMesh?: () => PremadeMeshTypes;

    texture?: THREE.Texture;
    quad?: THREE.Mesh;
    getTexture?: () => THREE.Texture | undefined;
    getQuad?: () => THREE.Mesh | undefined;

    prepare: (options: any) => Promise<any>;
    update: (time: number, updateOptions?: any) => void;
}
