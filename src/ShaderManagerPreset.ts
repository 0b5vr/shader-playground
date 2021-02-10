export interface ShaderManagerPreset {
  width: number;
  height: number;
  layers: Array<{
    code: string;
    textures?: { [ name: string ]: string };
  }>;
}
