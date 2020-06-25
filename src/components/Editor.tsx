import * as LayersContext from '../contexts/Layers';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import { Contexts } from '../contexts/Contexts';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

import 'ace-builds/src-noconflict/mode-glsl'; // eslint-disable-line
import 'ace-builds/src-noconflict/theme-monokai'; // eslint-disable-line

// == styles =======================================================================================
const StyledEditor = styled( AceEditor )`
  width: 100%;
  height: 100%;
`;

const Root = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
`;

// == element ======================================================================================
export interface EditorProps {
  className?: string;
}

export const Editor = ( { className }: EditorProps ): JSX.Element => {
  const contexts = useContext( Contexts.Store );
  const [ hasEdited, setHasEdited ] = useState( false );

  useEffect(
    () => {
      if ( hasEdited ) {
        const unloadHandler = ( event: BeforeUnloadEvent ): void => {
          event.preventDefault();
          event.returnValue = 'Are you sure?';
        };
        window.addEventListener( 'beforeunload', unloadHandler );

        return () => {
          window.removeEventListener( 'beforeunload', unloadHandler );
        };
      }
    },
    [ hasEdited ]
  );

  const handleExec = useRef<() => void>();
  handleExec.current = (): void => {
    const index = contexts.state.layers.selectedIndex!;
    const code = contexts.state.layers.layers[ index ].code;
    const layer = SHADERMAN.layers[ index ];

    try {
      layer!.compileShader( code );
    } catch ( e ) {
      console.error( e ); // TODO: more proper error output
    }
  };

  const handleChange = ( newValue: string ): void => {
    setHasEdited( true );
    contexts.dispatch( {
      type: LayersContext.ActionType.EditCode,
      index: contexts.state.layers.selectedIndex!,
      code: newValue
    } );
  };

  const commands = [
    {
      name: 'Execute',
      bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
      exec: () => handleExec.current!()
    }
  ];

  return <>
    <Root className={ className }>
      <StyledEditor
        mode="glsl"
        theme="monokai"
        width=""
        height=""
        tabSize={ 2 }
        value={ contexts.state.layers.layers[ contexts.state.layers.selectedIndex || 0 ]?.code }
        onChange={ handleChange }
        commands={ commands }
      />
    </Root>
  </>;
};
