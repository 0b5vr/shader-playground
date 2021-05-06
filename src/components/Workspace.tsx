import React, { useCallback } from 'react';
import { useDispatch, useSelector } from '../states/store';
import { Colors } from '../constants/Colors';
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
  const { view } = useSelector( ( state ) => ( {
    view: state.workspace.view,
  } ) );
  const dispatch = useDispatch();

  const canvas = useCallback( ( canvas: HTMLCanvasElement ) => {
    if ( canvas ) {
      SHADERMAN.attachCanvas( canvas );
      dispatch( {
        type: 'ShaderManager/ChangeResolution',
        width: SHADERMAN.width,
        height: SHADERMAN.height,
      } );

      const layer = SHADERMAN.createLayer( 'layer0' );
      const layerIndex = SHADERMAN.layers.indexOf( layer );
      dispatch( {
        type: 'ShaderManager/SelectLayer',
        layerIndex,
      } );

      SHADERMAN.setScreenLayer( layerIndex );
    }
  }, [] );

  const handleMouseDown = ( event: React.MouseEvent ): void => {
    if ( event.button === 1 ) {
      registerMouseEvent(
        ( event, movementSum ) => {
          const invPixelRatio = 1.0 / window.devicePixelRatio;
          dispatch( {
            type: 'Workspace/MoveView',
            x: movementSum.x * invPixelRatio,
            y: movementSum.y * invPixelRatio,
          } );
        }
      );
    }
  };

  const handleWheel = ( event: React.WheelEvent ): void => {
    dispatch( {
      type: 'Workspace/ZoomView',
      zoom: -0.001 * event.deltaY,
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
