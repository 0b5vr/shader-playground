import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';
import imgSdfFmsCat from '../../images/sdf-fms-cat.png';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 256,
  layers: [
    {
      code: fragMain,
      textures: {
        sampler0: imgSdfFmsCat,
      },
    },
  ],
};

export default preset;
