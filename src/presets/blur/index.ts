import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragBlurH from './blur-h.frag?raw';
import fragBlurV from './blur-v.frag?raw';
import fragDry from './dry.frag?raw';
import imgLondon from '../../images/london.jpg';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 512,
  screenLayer: 'layerBlurV',
  layers: [
    {
      name: 'layerDry',
      code: fragDry,
      textures: [
        {
          name: 'sampler0',
          url: imgLondon,
        },
      ],
    },
    {
      name: 'layerBlurH',
      code: fragBlurH,
    },
    {
      name: 'layerBlurV',
      code: fragBlurV,
    },
  ],
};

export default preset;
