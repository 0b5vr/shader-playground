import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';

const preset: ShaderManagerPreset = {
  width: 256,
  height: 256,
  screenLayer: 'layer0',
  layers: [
    {
      name: 'layer0',
      code: fragMain,
    },
  ],
};

export default preset;
