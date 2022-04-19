import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag?raw';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 512,
  screenLayer: 'layer0',
  layers: [
    {
      name: 'layer0',
      code: fragMain,
    },
  ],
};

export default preset;
