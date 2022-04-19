import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../states/store';
import { Colors } from '../constants/Colors';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';

const Root = styled.div`
  background: ${ Colors.back3 };
  cursor: col-resize;
`;

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export const EditorSeparator = ( { className, style }: Props ): JSX.Element => {
  const editorWidth = useSelector( ( state ) => state.workspace.editorWidth );
  const [ editorWidthMax, setEditorWidthMax ] = useState( 0 );
  const dispatch = useDispatch();

  const handleMouseDown = useCallback(
    ( event: React.MouseEvent ) => {
      event.preventDefault();

      let width = editorWidth;

      registerMouseEvent(
        ( event, movementSum ) => {
          event.preventDefault();
          event.stopPropagation();

          width = Math.min( Math.max( width - movementSum.x, 240.0 ), editorWidthMax - 240.0 );

          dispatch( {
            type: 'Workspace/ChangeEditorWidth',
            width,
          } );
        },
      );
    },
    [ dispatch, editorWidth, editorWidthMax ]
  );

  useEffect( () => {
    setEditorWidthMax( window.innerWidth );

    const handleResize = (): void => {
      setEditorWidthMax( window.innerWidth );

      if ( editorWidth > window.innerWidth - 240 ) {
        dispatch( {
          type: 'Workspace/ChangeEditorWidth',
          width: window.innerWidth - 240,
        } );
      }
    };

    window.addEventListener( 'resize', handleResize );

    return () => window.removeEventListener( 'resize', handleResize );
  }, [ dispatch, editorWidth ] );

  return (
    <Root
      className={ className }
      style={ style }
      onMouseDown={ handleMouseDown }
    />
  );
};
