import { produce } from 'immer';

// == state ========================================================================================
export interface State {
  selectedIndex?: number;
  layers: Array<{
    code: string;
    textures: Array<{
      url: string;
    }>;
  }>;
}

export const initialState: Readonly<State> = {
  selectedIndex: undefined,
  layers: []
};

// == action =======================================================================================
export enum ActionType {
  SelectLayer = 'Layers/SelectLayer',
  AddLayer = 'Layers/AddLayer',
  EditCode = 'Layers/EditCode',
  AddTexture = 'Layers/AddTexture'
}

interface Action {
  type: ActionType;
  [ key: string ]: any;
}

// == reducer ======================================================================================
export function reducer(
  state: State,
  action: Action
): State {
  return produce( state, ( newState: State ) => {
    if ( action.type === ActionType.SelectLayer ) {
      newState.selectedIndex = action.index;
    } else if ( action.type === ActionType.AddLayer ) {
      newState.layers.push( {
        code: action.code,
        textures: []
      } );
    } else if ( action.type === ActionType.EditCode ) {
      newState.layers[ action.index ].code = action.code;
    } else if ( action.type === ActionType.AddTexture ) {
      newState.layers[ action.index ].textures.push( {
        url: action.url
      } );
    }
  } );
}
