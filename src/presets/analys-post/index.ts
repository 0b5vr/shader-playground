import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';
import imgRandom from '../../images/-rgba256.png';
import imgWeAreBack from '../../images/we-are-back.png';

const preset: ShaderManagerPreset = {
  width: 640,
  height: 480,
  layers: [
    {
      code: fragMain,
      textures: [
        {
          name: 'sampler0',
          url: imgWeAreBack,
        },
        {
          name: 'samplerRandom',
          url: imgRandom,
          filter: 'linear',
        }
      ],
    },
  ],
};

export default preset;
