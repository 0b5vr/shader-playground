import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';
import imgMergeCat from '../../images/merge-cat.png';

const preset: ShaderManagerPreset = {
  width: 640,
  height: 480,
  screenLayer: 'layer0',
  layers: [
    {
      name: 'layer0',
      code: fragMain,
      textures: [
        {
          name: 'sampler0',
          url: imgMergeCat,
        },
      ],
    },
  ],
};

export default preset;
