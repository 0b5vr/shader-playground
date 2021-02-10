import { ShaderManagerPreset } from '../ShaderManagerPreset';
import analysPost from './analys-post';
import colorDeficiencies from './color-deficiencies';
import raymarchSdf from './raymarch-sdf';
import uv from './uv';
import zoom from './zoom';

export const presets: { [ name: string ]: ShaderManagerPreset | undefined } = {
  analysPost,
  colorDeficiencies,
  raymarchSdf,
  uv,
  zoom,
};
