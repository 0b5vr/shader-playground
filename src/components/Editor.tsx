import './codemirror-themes/monokai-sharp.css';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../states/store';
import CodeMirror from 'codemirror';
import { Controlled as ReactCodeMirror } from 'react-codemirror2';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledCodeMirror = styled( ReactCodeMirror )<{ visible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  visibility: ${ ( { visible } ) => visible ? 'visible' : 'hidden' };
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

  const handleEditorDidMount = useCallback(
    ( editor: CodeMirror.Editor ) => {
      editor.addKeyMap( {
        'Ctrl-S': () => {
          handleExec.current?.( false );
        },
        'Ctrl-R': () => {
          handleExec.current?.( true );
        },
      } );
    },
    [ handleExec ]
  );

  const handleBeforeChange = useCallback(
    ( editor: CodeMirror.Editor, data: CodeMirror.EditorChange, value: string ) => {
      setHasEdited( true );
      dispatch( {
        type: 'ShaderManager/ChangeLayerCode',
        layerIndex,
        code: value,
        markDirty: true,
      } );
    },
    []
  );

  const handleChange = useCallback(
    () => {
      // do nothing
    },
    []
  );

  return <StyledCodeMirror
    value={ code }
    options={ {
      mode: 'x-shader/x-fragment',
      keyMap: 'sublime',
      theme: 'monokai-sharp',
      lineNumbers: true,
    } }
    editorDidMount={ handleEditorDidMount }
    onBeforeChange={ handleBeforeChange }
    onChange={ handleChange }
    visible={ isSelected }
  />;
};
