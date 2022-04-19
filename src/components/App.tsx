import { Action, State, useSelector } from '../states/store';
import styled, { createGlobalStyle } from 'styled-components';
import { Colors } from '../constants/Colors';
import { EditorSeparator } from './EditorSeparator';
import { Editors } from './Editors';
import { Metrics } from '../constants/Metrics';
import { PaneList } from './PaneList';
import { Provider } from 'react-redux';
import React from 'react';
import { ShaderManagerStateListener } from './ShaderManagerStateListener';
import { Store } from 'redux';
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

const StyledEditors = styled( Editors )`
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
`;

const StyledWorkspace = styled( Workspace )`
  height: 100%;
  top: 0;
  position: absolute;
`;

const StyledEditorSeparator = styled( EditorSeparator )`
  width: 4px;
  height: 100%;
  top: 0;
  position: absolute;
  background: ${ Colors.back3 };
  cursor: col-resize;
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
const OutOfContextApp: React.FC = () => {
  const editorWidth = useSelector( ( style ) => style.workspace.editorWidth );

  return <>
    <Root>
      <ShaderManagerStateListener />
      <StyledWorkspace
        style={ { width: `calc( 100% - ${ editorWidth - 4 }px )` } }
      />
      <StyledEditors
        style={ { width: editorWidth } }
      />
      <StyledEditorSeparator
        style={ { right: editorWidth } }
      />
      <PaneList />
    </Root>
  </>;
};

export const App: React.FC<{
  store: Store<State, Action>;
}> = ( { store } ) => <>
  <GlobalStyle />
  <Provider store={ store }>
    <OutOfContextApp />
  </Provider>
</>;
