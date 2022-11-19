import './codemirror-themes/monokai-sharp.css';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../states/store';
import CodeMirror from 'codemirror';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

// == styles =======================================================================================
const CodeMirrorContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  visibility: ${ ( { visible } ) => visible ? 'visible' : 'hidden' };

  .CodeMirror {
    height: 100%;
  }
`;

// == element ======================================================================================
interface Props {
  layerIndex: number;
}

export const Editor: React.FC<Props> = ( { layerIndex } ) => {
  const { isSelected, code } = useSelector( ( state ) => {
    const isSelected = state.shaderManager.selectedLayerIndex === layerIndex;
    const layer = state.shaderManager.layers[ layerIndex ];
    const code = layer?.code;

    return { isSelected, code };
  } );
  const dispatch = useDispatch();

  const [ editor, setEditor ] = useState<CodeMirror.Editor>();
  const [ hasEdited, setHasEdited ] = useState( false );

  // instantiate the editor
  const refContainer = useCallback( ( element: HTMLDivElement ) => {
    setEditor( CodeMirror( element, {
      value: code,
      mode: 'x-shader/x-fragment',
      keyMap: 'sublime',
      theme: 'monokai-sharp',
      lineNumbers: true,
      tabSize: 2,
    } ) );
  }, [] );

  // change code
  useEffect(
    () => {
      if ( editor == null ) { return; }

      const currentValue = editor.getValue();

      if ( code !== currentValue ) {
        editor?.setValue( code );
      }
    },
    [ editor, code ]
  );

  // install onchange
  useEffect(
    () => {
      if ( editor == null ) { return; }

      editor.on( 'change', () => {
        setHasEdited( true );
        dispatch( {
          type: 'ShaderManager/ChangeLayerCode',
          layerIndex,
          code: editor.getValue(),
          markDirty: true,
        } );
      } );
    },
    [ editor ]
  );

  // install beforeunload
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

  const handleExec = useCallback( ( rewind: boolean ): void => {
    const actualLayer = SHADERMAN.layers[ layerIndex ];
    if ( editor == null ) { return; }

    try {
      actualLayer.compileShader( editor.getValue() );
      if ( rewind ) { SHADERMAN.rewind(); }
    } catch ( e ) {
      console.error( e ); // TODO: more proper error output
    }
  }, [ editor ] );

  // install keyboard shortcuts
  useEffect( () => {
    if ( editor == null ) { return; }

    const map = {
      'Ctrl-S': () => {
        handleExec( false );
      },
      'Ctrl-R': () => {
        handleExec( true );
      },
    };

    editor.addKeyMap( map );

    return () => {
      editor?.removeKeyMap( map );
    };
  }, [ editor, handleExec ] );

  return <CodeMirrorContainer
    ref={ refContainer }
    visible={ isSelected }
  />;
};
