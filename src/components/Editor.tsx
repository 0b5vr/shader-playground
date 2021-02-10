import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../states/store';
import AceEditor from 'react-ace';
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
  const { layerIndex, code } = useSelector( ( state ) => {
    const layerIndex = state.shaderManager.selectedLayerIndex;
    const layer = ( layerIndex != null )
      ? state.shaderManager.layers[ layerIndex ]
      : null;
    const code = layer?.code;

    return { layerIndex, code };
  } );
  const dispatch = useDispatch();

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
    const actualLayer = ( layerIndex != null ) ? SHADERMAN.layers[ layerIndex ] : null;
    if ( !actualLayer || code == null ) { return; }

    try {
      actualLayer.compileShader( code );
    } catch ( e ) {
      console.error( e ); // TODO: more proper error output
    }
  };

  const handleChange = ( newValue: string ): void => {
    if ( layerIndex == null ) { return; }

    setHasEdited( true );
    dispatch( {
      type: 'ShaderManager/ChangeLayerCode',
      layerIndex,
      code: newValue,
      markDirty: true,
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
        value={ code }
        onChange={ handleChange }
        commands={ commands }
      />
    </Root>
  </>;
};
