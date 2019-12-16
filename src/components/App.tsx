import styled, { createGlobalStyle } from 'styled-components';
import { Colors } from '../constants/Colors';
import { Contexts } from '../contexts/Contexts';
import { Editor } from './Editor';
import { Header } from './Header';
import { Metrics } from '../constants/Metrics';
import React from 'react';
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
  height: calc( 100% - ${ Metrics.texturesHeight } - ${ Metrics.headerHeight } );
  position: absolute;
  right: 0;
  top: ${ Metrics.headerHeight };
`;

const StyledWorkspace = styled( Workspace )`
  width: calc( 100% - ${ Metrics.editorWidth } );
  height: calc( 100% - ${ Metrics.headerHeight } );
  top: ${ Metrics.headerHeight };
  position: absolute;
`;

const StyledHeader = styled( Header )`
  width: 100%;
  height: ${ Metrics.headerHeight };
  left: 0;
  top: 0;
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
      <StyledWorkspace />
      <StyledEditor />
      <StyledTextures />
      <StyledHeader />
    </Root>
  </>;
};

export const App = (): JSX.Element => <>
  <GlobalStyle />
  <Contexts.Provider>
    <OutOfContextApp />
  </Contexts.Provider>
</>;
