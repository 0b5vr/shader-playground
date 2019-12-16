import * as Layers from './Layers';
import * as ShaderManager from './ShaderManager';
import * as Workspace from './Workspace';
import React, { createContext, useReducer } from 'react';

// == utils ========================================================================================
function combineReducers<T>( reducers: any ): ( ( state: any, action: any ) => T ) {
  return ( state: any = {}, action: any ) => {
    const keys = Object.keys( reducers );
    const nextReducers: any = {};
    for ( let i = 0; i < keys.length; i ++ ) {
      const invoke = reducers[ keys[ i ] ]( state[ keys[ i ] ], action );
      nextReducers[ keys[ i ] ] = invoke;
    }
    return nextReducers;
  };
}

// == state ========================================================================================
export interface ContextsState {
  layers: Layers.State;
  shaderManager: ShaderManager.State;
  workspace: Workspace.State;
}

const initialState: Readonly<ContextsState> = {
  layers: Layers.initialState,
  shaderManager: ShaderManager.initialState,
  workspace: Workspace.initialState
};

// == reducer ======================================================================================
const reducer = combineReducers<ContextsState>( {
  layers: Layers.reducer,
  shaderManager: ShaderManager.reducer,
  workspace: Workspace.reducer
} );

// == context ======================================================================================
interface StoreType {
  state: ContextsState;
  dispatch: React.Dispatch<any>;
}

const Store = createContext<StoreType>( undefined as any as StoreType );

const Provider = ( { children }: { children: JSX.Element } ): JSX.Element => {
  const [ state, dispatch ] = useReducer( reducer, initialState );
  return <Store.Provider value={ { state, dispatch } }>{ children }</Store.Provider>;
};

export const Contexts = {
  Store,
  Provider
};
