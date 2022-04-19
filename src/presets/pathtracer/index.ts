import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragAccumulate from './accumulate.frag?raw';
import fragDraw from './draw.frag?raw';
import fragPresent from './present.frag?raw';
import imgRandom from '../../images/-rgba256.png';
import imgReference from './reference.png';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 256,
  screenLayer: 'layerPresent',
  layers: [
    {
      name: 'layerDraw',
      code: fragDraw,
      textures: [
        {
          name: 'samplerRandom',
          url: imgRandom,
          filter: 'linear',
        },
      ],
    },
    {
      name: 'layerAccumulate',
      code: fragAccumulate,
    },
    {
      name: 'layerPresent',
      code: fragPresent,
      textures: [
        {
          name: 'samplerReference',
          url: imgReference,
          filter: 'nearest',
        },
      ],
    },
  ],
};

export default preset;
