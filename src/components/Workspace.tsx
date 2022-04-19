import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from '../states/store';
import { Colors } from '../constants/Colors';
import { SHADERMAN } from '../ShaderManager';
import { registerMouseEvent } from '../utils/registerMouseEvent';
import styled from 'styled-components';

// == styles =======================================================================================
const Canvas = styled.canvas`
  margin: 0;
  padding: 0;
  position: absolute;
  left: 50%;
  top: 50%;
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
  style?: React.CSSProperties;
}

export const Workspace = ( { className, style }: WorkspaceProps ): JSX.Element => {
  const { view } = useSelector( ( state ) => ( {
    view: state.workspace.view,
  } ) );
  const dispatch = useDispatch();

  const transform = useMemo( () => {
    let transform = `translateX( calc( ${ view.zoom * view.x }px - 50% ) ) `;
    transform += `translateY( calc( ${ view.zoom * view.y }px - 50% ) ) `;
    transform += `scale( ${ view.zoom } )`;
    return transform;
  }, [ view ] );

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

  const handleMouseDown = useCallback( ( event: React.MouseEvent ): void => {
    if ( event.button === 1 ) {
      registerMouseEvent(
        ( event, movementSum ) => {
          const multiplier = 1.0 / window.devicePixelRatio / view.zoom;
          dispatch( {
            type: 'Workspace/MoveView',
            x: movementSum.x * multiplier,
            y: movementSum.y * multiplier,
          } );
        }
      );
    }
  }, [ dispatch, view.zoom ] );

  const handleWheel = ( event: React.WheelEvent ): void => {
    dispatch( {
      type: 'Workspace/ZoomView',
      zoom: -0.001 * event.deltaY,
    } );
  };

  return <>
    <Root className={ className }
      style={ style }
      onMouseDown={ handleMouseDown }
      onWheel={ handleWheel }
    >
      <Background />
      <Canvas
        ref={ canvas }
        style={ { transform } }
      />
    </Root>
  </>;
};
