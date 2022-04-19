import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag?raw';
import imgLondon from '../../images/london.jpg';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 512,
  screenLayer: 'layer0',
  layers: [
    {
      name: 'layer0',
      code: fragMain,
      textures: [
        {
          name: 'sampler0',
          url: imgLondon,
        }
      ],
    },
  ],
};

export default preset;
