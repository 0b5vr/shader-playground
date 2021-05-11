import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragAccumulate from './accumulate.frag';
import fragDraw from './draw.frag';
import fragPresent from './present.frag';

const preset: ShaderManagerPreset = {
  width: 1280,
  height: 720,
  screenLayer: 'layerPresent',
  layers: [
    {
      name: 'layerDraw',
      code: fragDraw,
    },
    {
      name: 'layerAccumulate',
      code: fragAccumulate,
    },
    {
      name: 'layerPresent',
      code: fragPresent,
    },
  ],
};

export default preset;
