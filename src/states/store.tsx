import * as ShaderManager from './ShaderManager';
import * as Workspace from './Workspace';
import { Dispatch, Store, combineReducers, createStore as createReduxStore } from 'redux';
import { shallowEqual, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';

// == state ========================================================================================
export interface State {
  shaderManager: ShaderManager.State;
  workspace: Workspace.State;
}

// == action =======================================================================================
export type Action =
  | ShaderManager.Action
  | Workspace.Action;

// == reducer ======================================================================================
const reducer = combineReducers<State>( {
  shaderManager: ShaderManager.reducer,
  workspace: Workspace.reducer,
} );

// == store ========================================================================================
const devtools = ( window as any ).__REDUX_DEVTOOLS_EXTENSION__;
export function createStore(): Store<State, Action> {
  return createReduxStore(
    reducer,
    devtools && devtools()
  );
}

// == utils ========================================================================================
export function useSelector<T>( selector: ( state: State ) => T ): T {
  return useReduxSelector( selector, shallowEqual );
}

export function useDispatch(): Dispatch<Action> {
  return useReduxDispatch<Dispatch<Action>>();
}
