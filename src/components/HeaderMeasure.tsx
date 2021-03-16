import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Root = styled.div`
`;

// == element ======================================================================================
export interface HeaderMeasureProps {
  className?: string;
}

export const HeaderMeasure = ( { className }: HeaderMeasureProps ): JSX.Element => {
  const gpuTime = useSelector( ( state ) => {
    const layerIndex = state.shaderManager.selectedLayerIndex;
    const layer = ( layerIndex != null )
      ? state.shaderManager.layers[ layerIndex ]
      : null;

    const gpuTime = layer?.gpuTime;

    return gpuTime;
  } );

  const [ measureMode, setMeasureMode ] = useState<'frame' | 'median'>( 'frame' );

  const handleClick = useCallback( () => {
    if ( measureMode === 'frame' ) {
      setMeasureMode( 'median' );
    } else if ( measureMode === 'median' ) {
      setMeasureMode( 'frame' );
    }
  }, [ measureMode ] );

  const numMs = gpuTime?.[ measureMode ];

  const textMs = `${ numMs?.toFixed( 3 ) ?? '----' } ms`;

  return <>
    <Root
      className={ className }
      onClick={ handleClick }
    >
      GPUTime ({ measureMode }): { textMs }
    </Root>
  </>;
};
