import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';

const preset: ShaderManagerPreset = {
  width: 256,
  height: 256,
  layers: [
    {
      code: fragMain,
    },
  ],
};

export default preset;
