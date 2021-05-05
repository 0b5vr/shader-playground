import React from 'react';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Root = styled.div`
  padding: 8px;
`;

// == element ======================================================================================
export const Performance = (): JSX.Element => {
  const gpuTime = useSelector( ( state ) => {
    const layerIndex = state.shaderManager.selectedLayerIndex;
    const layer = ( layerIndex != null )
      ? state.shaderManager.layers[ layerIndex ]
      : null;

    const gpuTime = layer?.gpuTime;

    return gpuTime;
  } );

  const frameMs = `${ gpuTime?.frame?.toFixed( 3 ) ?? '----' } ms`;
  const medianMs = `${ gpuTime?.median?.toFixed( 3 ) ?? '----' } ms`;

  return <>
    <Root>
      <div>GPUTime (frame): { frameMs }</div>
      <div>GPUTime (median): { medianMs }</div>
    </Root>
  </>;
};
