import { ShaderManagerTextureFilter, ShaderManagerTextureWrap } from './ShaderManagerTexture';

export interface ShaderManagerPreset {
  width: number;
  height: number;
  screenLayer: string;
  layers: Array<{
    name: string;
    code: string;
    textures?: Array<{
      name: string;
      url: string;
      wrap?: ShaderManagerTextureWrap;
      filter?: ShaderManagerTextureFilter;
    }>;
  }>;
}
