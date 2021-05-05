import { Action, State } from '../states/store';
import styled, { createGlobalStyle } from 'styled-components';
import { Colors } from '../constants/Colors';
import { Editor } from './Editor';
import { Metrics } from '../constants/Metrics';
import { PaneList } from './PaneList';
import { Provider } from 'react-redux';
import React from 'react';
import { ShaderManagerStateListener } from './ShaderManagerStateListener';
import { Store } from 'redux';
import { Textures } from './Textures';
import { Workspace } from './Workspace';

// == styles =======================================================================================
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono:400');

  html {
    font-size: ${ Metrics.rootFontSize };
  }

  body {
    margin: 0;
    padding: 0;
  }
`;

const StyledTextures = styled( Textures )`
  width: ${ Metrics.editorWidth };
  height: ${ Metrics.texturesHeight };
  position: absolute;
  right: 0;
  bottom: 0;
`;

const StyledEditor = styled( Editor )`
  width: ${ Metrics.editorWidth };
  height: calc( 100% - ${ Metrics.texturesHeight } );
  position: absolute;
  right: 0;
  top: 0;
`;

const StyledWorkspace = styled( Workspace )`
  width: calc( 100% - ${ Metrics.editorWidth } );
  height: 100%;
  top: 0;
  position: absolute;
`;

const Root = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  color: ${ Colors.fore };
`;


// == element ======================================================================================
const OutOfContextApp = (): JSX.Element => {
  return <>
    <Root>
      <ShaderManagerStateListener />
      <StyledWorkspace />
      <StyledEditor />
      <StyledTextures />
      <PaneList />
    </Root>
  </>;
};

export const App = ( { store }: {
  store: Store<State, Action>;
} ): JSX.Element => <>
  <GlobalStyle />
  <Provider store={ store }>
    <OutOfContextApp />
  </Provider>
</>;
