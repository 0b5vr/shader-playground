import { Reducer } from 'redux';
import { produce } from 'immer';

// == state ========================================================================================
export interface State {
  view: {
    x: number;
    y: number;
    zoom: number;
  };
  editorWidth: number;
}

export const initialState: Readonly<State> = {
  view: {
    x: 0.0,
    y: 0.0,
    zoom: 1.0
  },
  editorWidth: 600,
};

// == action =======================================================================================
export type Action = {
  type: 'Workspace/MoveView';
  x: number;
  y: number;
} | {
  type: 'Workspace/ZoomView';
  zoom: number;
} | {
  type: 'Workspace/ChangeEditorWidth';
  width: number;
};

// == reducer ======================================================================================
export const reducer: Reducer<State, Action> = ( state = initialState, action ) => {
  return produce( state, ( newState: State ) => {
    if ( action.type === 'Workspace/MoveView' ) {
      newState.view.x += action.x;
      newState.view.y += action.y;
    } else if ( action.type === 'Workspace/ZoomView' ) {
      const z = Math.log( newState.view.zoom ) + action.zoom;
      newState.view.zoom = Math.exp( z );
    } else if ( action.type === 'Workspace/ChangeEditorWidth' ) {
      newState.editorWidth = action.width;
    }
  } );
};
