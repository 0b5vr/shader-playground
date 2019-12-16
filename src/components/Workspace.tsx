import * as Layers from '../contexts/Layers';
import * as ShaderManagerContext from '../contexts/ShaderManager';
import * as WorkspaceContext from '../contexts/Workspace';
import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { Contexts } from '../contexts/Contexts';
import { SHADERMAN } from '../ShaderManager';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';

// == styles =======================================================================================
const Canvas = styled.canvas<{ x: number; y: number; zoom: number }>`
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  ${ ( { x, y, zoom } ) => `transform: translateX( calc( ${ x }px - 50% ) ) translateY( calc( ${ y }px - 50% ) ) scale( ${ zoom } );` }
`;

const Background = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: ${ Colors.back2 };
`;

const Root = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
`;

// == element ======================================================================================
export interface WorkspaceProps {
  className?: string;
}

export const Workspace = ( { className }: WorkspaceProps ): JSX.Element => {
  const contexts = useContext( Contexts.Store );

  const view = contexts.state.workspace.view;

  const canvas = useCallback( ( canvas: HTMLCanvasElement ) => {
    if ( canvas ) {
      SHADERMAN.attachCanvas( canvas );
      contexts.dispatch( {
        type: ShaderManagerContext.ActionType.ChangeResolution,
        width: SHADERMAN.width,
        height: SHADERMAN.height
      } );

      const layer = SHADERMAN.createLayer();
      contexts.dispatch( {
        type: Layers.ActionType.AddLayer,
        code: layer.code
      } );
      contexts.dispatch( {
        type: Layers.ActionType.SelectLayer,
        index: 0
      } );
    }
  }, [] );

  const handleMouseDown = ( event: React.MouseEvent ): void => {
    if ( event.button === 1 ) {
      registerMouseEvent(
        ( event, movementSum ) => {
          const invPixelRatio = 1.0 / window.devicePixelRatio;
          contexts.dispatch( {
            type: WorkspaceContext.ActionType.MoveView,
            x: movementSum.x * invPixelRatio,
            y: movementSum.y * invPixelRatio
          } );
        }
      );
    }
  };

  const handleWheel = ( event: React.WheelEvent ): void => {
    contexts.dispatch( {
      type: WorkspaceContext.ActionType.ZoomView,
      zoom: -0.001 * event.deltaY
    } );
  };

  return <>
    <Root className={ className }
      onMouseDown={ handleMouseDown }
      onWheel={ handleWheel }
    >
      <Background />
      <Canvas ref={ canvas } { ...view } />
    </Root>
  </>;
};
