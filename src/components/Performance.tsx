import React from 'react';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Root = styled.div`
  padding: 8px;
`;

// == element ======================================================================================
export const Performance: React.FC = () => {
  const gpuTime = useSelector( ( state ) => {
    const layerId = state.shaderManager.selectedLayerId;
    const layer = ( layerId != null )
      ? state.shaderManager.layers.find( ( layer ) => layer.id === layerId )
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
