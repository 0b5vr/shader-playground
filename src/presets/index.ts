import { ShaderManagerPreset } from '../ShaderManagerPreset';
import analysPost from './analys-post';
import colorDeficiencies from './color-deficiencies';
import raymarchSdf from './raymarch-sdf';
import texture from './texture';
import uv from './uv';
import zoom from './zoom';

export const presets: { [ name: string ]: ShaderManagerPreset | undefined } = {
  analysPost,
  colorDeficiencies,
  raymarchSdf,
  texture,
  uv,
  zoom,
};
