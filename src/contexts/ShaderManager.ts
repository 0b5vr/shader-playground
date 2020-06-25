import { produce } from 'immer';

// == state ========================================================================================
export interface State {
  width: number;
  height: number;
  isRecording: boolean;
}

export const initialState: Readonly<State> = {
  width: 0,
  height: 0,
  isRecording: false
};

// == action =======================================================================================
export enum ActionType {
  ChangeResolution = 'ShaderManager/ChangeResolution',
  StartRecording = 'ShaderManager/StartRecording',
  EndRecording = 'ShaderManager/EndRecording',
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
    } else if ( action.type === ActionType.StartRecording ) {
      newState.isRecording = true;
    } else if ( action.type === ActionType.EndRecording ) {
      newState.isRecording = false;
    }
  } );
}
