import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../states/store';
import AceEditor from 'react-ace';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

import 'ace-builds/src-noconflict/mode-glsl'; // eslint-disable-line
import 'ace-builds/src-noconflict/theme-monokai'; // eslint-disable-line

// == styles =======================================================================================
const StyledEditor = styled( AceEditor )`
  position: absolute;
  width: 100%;
  height: 100%;
`;

// == element ======================================================================================
export interface EditorProps {
  layerIndex: number;
}

export const Editor = ( { layerIndex }: EditorProps ): JSX.Element => {
  const { isSelected, code } = useSelector( ( state ) => {
    const isSelected = state.shaderManager.selectedLayerIndex === layerIndex;
    const layer = state.shaderManager.layers[ layerIndex ];
    const code = layer?.code;

    return { isSelected, code };
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

  const handleExec = useRef<( rewind: boolean ) => void>();
  handleExec.current = ( rewind: boolean ): void => {
    const actualLayer = ( layerIndex != null ) ? SHADERMAN.layers[ layerIndex ] : null;
    if ( !actualLayer || code == null ) { return; }

    try {
      actualLayer.compileShader( code );
      if ( rewind ) { SHADERMAN.rewind(); }
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
      exec: () => handleExec.current?.( false ),
    },
    {
      name: 'Rewind',
      bindKey: { win: 'Ctrl-r', mac: 'Command-r' },
      exec: () => handleExec.current?.( true ),
    }
  ];

  return <StyledEditor
    mode="glsl"
    theme="monokai"
    width=""
    height=""
    tabSize={ 2 }
    value={ code }
    onChange={ handleChange }
    commands={ commands }
    style={ {
      visibility: isSelected ? 'visible' : 'hidden',
    } }
  />;
};
