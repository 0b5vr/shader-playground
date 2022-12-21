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
  selectedLayerId: string | null;
  screenLayerId: string | null;
  layers: Array<{
    id: string;
    name: string;
    code: string;
    isDirty: boolean;
    textures: Array<{
      id: string;
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
  selectedLayerId: null,
  screenLayerId: null,
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
  layerId: string | null;
} | {
  type: 'ShaderManager/ChangeScreenLayer';
  layerId: string | null;
} | {
  type: 'ShaderManager/ChangeLayerName';
  layerId: string;
  name: string;
} | {
  type: 'ShaderManager/ChangeLayerCode';
  layerId: string;
  code: string;
  markDirty?: boolean;
} | {
  type: 'ShaderManager/UpdateLayerGPUTime';
  layerId: string;
  gpuTime: {
    frame: number;
    median: number;
  };
} | {
  type: 'ShaderManager/AddLayer';
  layerId: string;
  index: number;
  name: string;
  code: string;
} | {
  type: 'ShaderManager/DeleteLayer';
  layerId: string;
} | {
  type: 'ShaderManager/ChangeLayerTextureUrl';
  layerId: string;
  textureId: string;
  url: string | undefined;
} | {
  type: 'ShaderManager/ChangeLayerTextureName';
  layerId: string;
  textureId: string;
  name: string;
} | {
  type: 'ShaderManager/ChangeLayerTextureWrap';
  layerId: string;
  textureId: string;
  wrap: ShaderManagerTextureWrap;
} | {
  type: 'ShaderManager/ChangeLayerTextureFilter';
  layerId: string;
  textureId: string;
  filter: ShaderManagerTextureFilter;
} | {
  type: 'ShaderManager/AddLayerTexture';
  layerId: string;
  textureId: string;
  index: number;
  name: string;
  url: string | undefined;
  wrap: ShaderManagerTextureWrap;
  filter: ShaderManagerTextureFilter;
} | {
  type: 'ShaderManager/DeleteLayerTexture';
  layerId: string;
  textureId: string;
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
      newState.selectedLayerId = action.layerId;
    } else if ( action.type === 'ShaderManager/ChangeScreenLayer' ) {
      newState.screenLayerId = action.layerId;
    } else if ( action.type === 'ShaderManager/ChangeLayerName' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      newState.layers[ layerIndex ].name = action.name;
    } else if ( action.type === 'ShaderManager/ChangeLayerCode' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      newState.layers[ layerIndex ].code = action.code;

      if ( action.markDirty ) {
        newState.layers[ layerIndex ].isDirty = true;
      }
    } else if ( action.type === 'ShaderManager/UpdateLayerGPUTime' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      if ( state.layers[ layerIndex ] ) { // async funny
        newState.layers[ layerIndex ].gpuTime = action.gpuTime;
      }
    } else if ( action.type === 'ShaderManager/AddLayer' ) {
      newState.layers[ action.index ] = {
        id: action.layerId,
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
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      newState.layers.splice( layerIndex, 1 );
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureUrl' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      const textures = state.layers[ layerIndex ].textures;
      const textureIndex = textures.findIndex( ( texture ) => texture.id === action.textureId );
      newState.layers[ layerIndex ].textures[ textureIndex ].url = action.url;
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureName' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      const textures = state.layers[ layerIndex ].textures;
      const textureIndex = textures.findIndex( ( texture ) => texture.id === action.textureId );
      newState.layers[ layerIndex ].textures[ textureIndex ].name = action.name;
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureWrap' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      const textures = state.layers[ layerIndex ].textures;
      const textureIndex = textures.findIndex( ( texture ) => texture.id === action.textureId );
      newState.layers[ layerIndex ].textures[ textureIndex ].wrap = action.wrap;
    } else if ( action.type === 'ShaderManager/ChangeLayerTextureFilter' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      const textures = state.layers[ layerIndex ].textures;
      const textureIndex = textures.findIndex( ( texture ) => texture.id === action.textureId );
      newState.layers[ layerIndex ].textures[ textureIndex ].filter = action.filter;
    } else if ( action.type === 'ShaderManager/AddLayerTexture' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      newState.layers[ layerIndex ].textures[ action.index ] = {
        id: action.textureId,
        name: action.name,
        url: action.url,
        wrap: action.wrap,
        filter: action.filter,
      };
    } else if ( action.type === 'ShaderManager/DeleteLayerTexture' ) {
      const layerIndex = state.layers.findIndex( ( layer ) => layer.id === action.layerId );
      const textures = state.layers[ layerIndex ].textures;
      const textureIndex = textures.findIndex( ( texture ) => texture.id === action.textureId );
      newState.layers[ layerIndex ].textures.splice( textureIndex, 1 );
    } else if ( action.type === 'ShaderManager/StartRecording' ) {
      newState.isRecording = true;
    } else if ( action.type === 'ShaderManager/EndRecording' ) {
      newState.isRecording = false;
    }
  } );
};
