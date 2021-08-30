import { ShaderManagerPreset } from '../ShaderManagerPreset';
import analysPost from './analys-post';
import blossom from './blossom';
import blur from './blur';
import colorDeficiencies from './color-deficiencies';
import colorGrading from './color-grading';
import cyclicNoise from './cyclic-noise';
import pathtracer from './pathtracer';
import raymarch from './raymarch';
import raymarchSdf from './raymarch-sdf';
import texture from './texture';
import uv from './uv';
import zoom from './zoom';

export const presets: { [ name: string ]: ShaderManagerPreset | undefined } = {
  analysPost,
  blossom,
  blur,
  colorDeficiencies,
  colorGrading,
  cyclicNoise,
  pathtracer,
  raymarch,
  raymarchSdf,
  texture,
  uv,
  zoom,
};
