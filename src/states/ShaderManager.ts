import { Reducer } from 'redux';
import { produce } from 'immer';

// == state ========================================================================================
export interface State {
  width: number;
  height: number;
  selectedLayerIndex: number | null;
  layers: Array<{
    code: string;
    isDirty: boolean;
    textures: Map<string, {
      url: string;
    }>;
    gpuTime: {
      frame: number;
      median: number;
    };
  }>;
  isRecording: boolean;
}

export const initialState: Readonly<State> = {
  width: 0,
  height: 0,
  selectedLayerIndex: null,
  layers: [],
  isRecording: false,
};

// == action =======================================================================================
export type Action = {
  type: 'ShaderManager/ChangeResolution';
  width: number;
  height: number;
} | {
  type: 'ShaderManager/SelectLayer';
  layerIndex: number | null;
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
  type: 'ShaderManager/AddLayer';
  layerIndex: number;
  code: string;
} | {
  type: 'ShaderManager/DeleteLayer';
  layerIndex: number;
} | {
  type: 'ShaderManager/AddLayer';
  code: string;
  layerIndex: number;
} | {
  type: 'ShaderManager/DeleteLayer';
  layerIndex: number;
} | {
  type: 'ShaderManager/AddLayerTexture';
  layerIndex: number;
  name: string;
  url: string;
} | {
  type: 'ShaderManager/DeleteLayerTexture';
  layerIndex: number;
  name: string;
} | {
  type: 'ShaderManager/StartRecording';
} | {
  type: 'ShaderManager/EndRecording';
}

// == reducer ======================================================================================
export const reducer: Reducer<State, Action> = ( state = initialState, action ) => {
  return produce( state, ( newState: State ) => {
    if ( action.type === 'ShaderManager/ChangeResolution' ) {
      newState.width = action.width;
      newState.height = action.height;
    } else if ( action.type === 'ShaderManager/SelectLayer' ) {
      newState.selectedLayerIndex = action.layerIndex;
    } else if ( action.type === 'ShaderManager/ChangeLayerCode' ) {
      newState.layers[ action.layerIndex ].code = action.code;

      if ( action.markDirty ) {
        newState.layers[ action.layerIndex ].isDirty = true;
      }
    } else if ( action.type === 'ShaderManager/UpdateLayerGPUTime' ) {
      newState.layers[ action.layerIndex ].gpuTime = action.gpuTime;
    } else if ( action.type === 'ShaderManager/AddLayer' ) {
      newState.layers[ action.layerIndex ] = {
        code: action.code,
        isDirty: false,
        textures: new Map(),
        gpuTime: {
          frame: 0.0,
          median: 0.0,
        },
      };
    } else if ( action.type === 'ShaderManager/DeleteLayer' ) {
      newState.layers.splice( action.layerIndex, 1 );
    } else if ( action.type === 'ShaderManager/AddLayerTexture' ) {
      newState.layers[ action.layerIndex ].textures.set( action.name, { url: action.url } );
    } else if ( action.type === 'ShaderManager/DeleteLayerTexture' ) {
      newState.layers[ action.layerIndex ].textures.delete( action.name );
    } else if ( action.type === 'ShaderManager/StartRecording' ) {
      newState.isRecording = true;
    } else if ( action.type === 'ShaderManager/EndRecording' ) {
      newState.isRecording = false;
    }
  } );
};
