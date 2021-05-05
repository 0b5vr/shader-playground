import { ShaderManagerTextureFilter, ShaderManagerTextureWrap } from './ShaderManagerTexture';

export interface ShaderManagerPreset {
  width: number;
  height: number;
  layers: Array<{
    code: string;
    textures?: Array<{
      name: string;
      url: string;
      wrap?: ShaderManagerTextureWrap;
      filter?: ShaderManagerTextureFilter;
    }>;
  }>;
}
