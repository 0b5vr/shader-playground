import { produce } from 'immer';

// == state ========================================================================================
export interface State {
  width: number;
  height: number;
}

export const initialState: Readonly<State> = {
  width: 0,
  height: 0
};

// == action =======================================================================================
export enum ActionType {
  ChangeResolution = 'ShaderManager/ChangeResolution'
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
    if ( action.type === ActionType.ChangeResolution ) {
      newState.width = action.width;
      newState.height = action.height;
    }
  } );
}
