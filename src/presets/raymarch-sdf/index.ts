import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag?raw';
import imgWhomst from '../../images/whomst.png';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 256,
  screenLayer: 'layer0',
  layers: [
    {
      name: 'layer0',
      code: fragMain,
      textures: [
        {
          name: 'sampler0',
          url: imgWhomst,
        },
      ],
    },
  ],
};

export default preset;
