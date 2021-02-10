import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';
import imgMergeCat from '../../images/merge-cat.png';

const preset: ShaderManagerPreset = {
  width: 640,
  height: 480,
  layers: [
    {
      code: fragMain,
      textures: {
        sampler0: imgMergeCat,
      },
    },
  ],
};

export default preset;
