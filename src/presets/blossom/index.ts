import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';

const preset: ShaderManagerPreset = {
  width: 1280,
  height: 720,
  screenLayer: 'layer0',
  layers: [
    {
      name: 'layer0',
      code: fragMain,
    },
  ],
};

export default preset;
