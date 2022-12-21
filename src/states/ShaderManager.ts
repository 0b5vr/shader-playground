import { ShaderManagerTextureFilter, ShaderManagerTextureWrap } from '../ShaderManagerTexture';
import { Reducer } from 'redux';
import { produce } from 'immer';

// == state ========================================================================================
export interface State {
  isPlaying: boolean;
  time: number;
  deltaTime: number;
  frame: number;
  timeMod: number;
  width: number;
  height: number;
  selectedLayerIndex: number | null;
  screenLayerIndex: number | null;
  layers: Array<{
    name: string;
    code: string;
    isDirty: boolean;
    textures: Array<{
      name: string;
      url: string | undefined;
      wrap: ShaderManagerTextureWrap;
      filter: ShaderManagerTextureFilter;
    }>;
    gpuTime: {
      frame: number;
      median: number;
    };
  }>;
  isRecording: boolean;
}

export const initialState: Readonly<State> = {
  isPlaying: true,
  time: 0.0,
  deltaTime: 0.0,
  frame: 0,
  timeMod: 0.0,
  width: 0,
  height: 0,
  selectedLayerIndex: null,
  screenLayerIndex: null,
  layers: [],
  isRecording: false,
};

// == action =======================================================================================
export type Action = {
  type: 'ShaderManager/SetIsPlaying';
  isPlaying: boolean;
} | {
  type: 'ShaderManager/UpdateTime';
  time: number;
  deltaTime: number;
  frame: number;
} | {
  type: 'ShaderManager/ChangeTimeMod';
  timeMod: number;
} | {
  type: 'ShaderManager/ChangeResolution';
  width: number;
  height: number;
} | {
  type: 'ShaderManager/SelectLayer';
  layerIndex: number | null;
} | {
  type: 'ShaderManager/ChangeScreenLayer';
  layerIndex: number | null;
} | {
  type: 'ShaderManager/ChangeLayerName';
  layerIndex: number;
  name: string;
} | {
  type: 'ShaderManager/ChangeLayerCode';
  layerIndex: number;
  code: string;
  markDirty?: boolean;
} | {
  type: 'ShaderManager/UpdateLayerGPUTime';
  layerIndex: number;
  gpuTime: {
    frame: number;
    median: number;
  };
} | {
  type: 'ShaderManager/DeleteLayer';
  layerIndex: number;
} | {
  type: 'ShaderManager/AddLayer';
  layerIndex: number;
  name: string;
  code: string;
} | {
  type: 'ShaderManager/DeleteLayer';
  layerIndex: number;
} | {
  type: 'ShaderManager/ChangeLayerTextureUrl';
  layerIndex: number;
  textureIndex: number;
  url: string | undefined;
} | {
  type: 'ShaderManager/ChangeLayerTextureName';
  layerIndex: number;
  textureIndex: number;
  name: string;
} | {
  type: 'ShaderManager/ChangeLayerTextureWrap';
  layerIndex: number;
  textureIndex: number;
  wrap: ShaderManagerTextureWrap;
} | {
  type: 'ShaderManager/ChangeLayerTextureFilter';
  layerIndex: number;
  textureIndex: number;
  filter: ShaderManagerTextureFilter;
} | {
  type: 'ShaderManager/AddLayerTexture';
  layerIndex: number;
  textureIndex: number;
  name: string;
  url: string | undefined;
  wrap: ShaderManagerTextureWrap;
  filter: ShaderManagerTextureFilter;
} | {
  type: 'ShaderManager/DeleteLayerTexture';
  layerIndex: number;
  textureIndex: number;
} | {
  type: 'ShaderManager/StartRecording';
} | {
  type: 'ShaderManager/EndRecording';
}

// == reducer ======================================================================================
export const reducer: Reducer<State, Action> = ( state = initialState, action ) => {
  return produce( state, ( newState: State ) => {
    if ( action.type === 'ShaderManager/SetIsPlaying' ) {
      newState.isPlaying = action.isPlaying;
    } else if ( action.type === 'ShaderManager/UpdateTime' ) {
      newState.time = action.time;
      newState.deltaTime = action.deltaTime;
      newState.frame = action.frame;
    } else if ( action.type === 'ShaderManager/ChangeTimeMod' ) {
      newState.timeMod = action.timeMod;
    } else if ( action.type === 'ShaderManager/ChangeResolution' ) {
      newState.width = action.width;
      newState.height = action.height;
    } else if ( action.type === 'ShaderManager/SelectLayer' ) {
      newState.selectedLayerIndex = action.layerIndex;
    } else if ( action.type === 'ShaderManager/ChangeScreenLayer' ) {
      newState.screenLayerIndex = action.layerIndex;
    } else if ( action.type === 'ShaderManager/ChangeLayerName' ) {
      newState.layers[ action.layerIndex ].name = action.name;
    } else if ( action.type === 'ShaderManager/ChangeLayerCode' ) {
      newState.layers[ action.layerIndex ].code = action.code;

      if ( action.markDirty ) {
        newState.layers[ action.layerIndex ].isDirty = true;
      }
    } else if ( action.type === 'ShaderManager/UpdateLayerGPUTime' ) {
      if ( state.layers[ action.layerIndex ] ) { // async funny
        newState.layers[ action.layerIndex ].gpuTime = action.gpuTime;
      }
    } else if ( action.type === 'ShaderManager/AddLayer' ) {
      newState.layers[ action.layerIndex ] = {
        name: action.name,
        code: action.code,
        isDirty: false,
        textures: [],
        gpuTime: {
          frame: 0.0,
          median: 0.0,
        },
      };
    } else if ( action.type === 'ShaderManager/DeleteLayer' ) {
      newState.layers.splice( action.layerIndex, 1 );
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureUrl' ) {
      newState.layers[ action.layerIndex ].textures[ action.textureIndex ].url = action.url;
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureName' ) {
      newState.layers[ action.layerIndex ].textures[ action.textureIndex ].name = action.name;
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureWrap' ) {
      newState.layers[ action.layerIndex ].textures[ action.textureIndex ].wrap = action.wrap;
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureFilter' ) {
      newState.layers[ action.layerIndex ].textures[ action.textureIndex ].filter = action.filter;
    } else if ( action.type === 'ShaderManager/AddLayerTexture' ) {
      newState.layers[ action.layerIndex ].textures[ action.textureIndex ] = {
        name: action.name,
        url: action.url,
        wrap: action.wrap,
        filter: action.filter,
      };
    } else if ( action.type === 'ShaderManager/DeleteLayerTexture' ) {
      newState.layers[ action.layerIndex ].textures.splice( action.textureIndex, 1 );
    } else if ( action.type === 'ShaderManager/StartRecording' ) {
      newState.isRecording = true;
    } else if ( action.type === 'ShaderManager/EndRecording' ) {
      newState.isRecording = false;
    }
  } );
};
