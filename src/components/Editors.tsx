import { Editor } from './Editor';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Root = styled.div``;

// == element ======================================================================================
export interface EditorsProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Editors = ( { className, style }: EditorsProps ): JSX.Element => {
  const { layerCount } = useSelector( ( state ) => {
    const layers = state.shaderManager.layers;
    const layerCount = layers.length;

    return { layerCount };
  } );

  return <>
    <Root className={ className } style={ style }>
      { [ ...new Array( layerCount ).keys() ].map( ( layerIndex ) => (
        <Editor key={ layerIndex }
          layerIndex={ layerIndex }
        />
      ) ) }
    </Root>
  </>;
};
