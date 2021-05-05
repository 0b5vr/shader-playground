import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';
import imgFmsCat from '../../images/fms-cat.png';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 512,
  layers: [
    {
      code: fragMain,
      textures: {
        sampler0: imgFmsCat,
      },
    },
  ],
};

export default preset;
