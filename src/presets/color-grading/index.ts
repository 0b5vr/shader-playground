import { ShaderManagerPreset } from '../../ShaderManagerPreset';
import fragMain from './main.frag';

const preset: ShaderManagerPreset = {
  width: 512,
  height: 512,
  layers: [
    {
      code: fragMain,
    },
  ],
};

export default preset;
