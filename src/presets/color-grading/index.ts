import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';
import imgFmsCat from '../../images/fms-cat.png';

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
          url: imgFmsCat,
        }
      ],
    },
  ],
};

export default preset;
