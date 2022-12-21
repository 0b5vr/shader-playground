import { Editor } from './Editor';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Root = styled.div``;

// == element ======================================================================================
interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export const Editors: React.FC<Props> = ( { className, style } ) => {
  const { layerIds } = useSelector( ( state ) => {
    const layerIds = state.shaderManager.layers.map( ( layer ) => layer.id );

    return { layerIds };
  } );

  return <>
    <Root className={ className } style={ style }>
      { layerIds.map( ( layerId ) => (
        <Editor key={ layerId }
          layerId={ layerId }
        />
      ) ) }
    </Root>
  </>;
};
