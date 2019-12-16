import { produce } from 'immer';

// == state ========================================================================================
export interface State {
  view: {
    x: number;
    y: number;
    zoom: number;
  };
}

export const initialState: Readonly<State> = {
  view: {
    x: 0.0,
    y: 0.0,
    zoom: 1.0
  }
};

// == action =======================================================================================
export enum ActionType {
  MoveView = 'Workspace/MoveView',
  ZoomView = 'Workspace/ZoomView'
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
    if ( action.type === ActionType.MoveView ) {
      newState.view.x += action.x;
      newState.view.y += action.y;
    } else if ( action.type === ActionType.ZoomView ) {
      const z = Math.log( newState.view.zoom ) + action.zoom;
      newState.view.zoom = Math.exp( z );
    }
  } );
}
