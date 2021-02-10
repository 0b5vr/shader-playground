import { useDispatch, useSelector } from '../states/store';
import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import React from 'react';
import { SHADERMAN } from '../ShaderManager';
import { Texture } from './Texture';
import styled from 'styled-components';

// == styles =======================================================================================
const StyledTexture = styled( Texture )`
  display: inline-block;
  width: calc( ${ Metrics.texturesHeight } - 2.0 * ${ Metrics.genericMargin } );
  height: calc( ${ Metrics.texturesHeight } - 2.0 * ${ Metrics.genericMargin } );

  & + & {
    margin-left: ${ Metrics.genericMargin };
  }
`;

const TexturesContainer = styled.div`
  padding: ${ Metrics.genericMargin };
  white-space: nowrap;
`;

const Root = styled.div`
  width: 100%;
  height: 100%;
  background: ${ Colors.back2 };
`;

// == element ======================================================================================
export interface TexturesProps {
  className?: string;
}

export const Textures = ( { className }: TexturesProps ): JSX.Element => {
  const { layerIndex, layer } = useSelector( ( state ) => {
    const layerIndex = state.shaderManager.selectedLayerIndex;
    const layer = ( layerIndex != null )
      ? state.shaderManager.layers[ layerIndex ]
      : null;

    return { layerIndex, layer };
  } );
  const dispatch = useDispatch();

  const handleDragOver = ( event: React.DragEvent ): void => {
    event.preventDefault();
  };

  const handleDrop = ( event: React.DragEvent ): void => {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if ( files ) {
      const actualLayer = ( layerIndex != null ) ? SHADERMAN.layers[ layerIndex ] : null;

      if ( layerIndex != null && actualLayer ) {
        Array.from( files ).forEach( ( file ) => {
          const blob = new Blob( [ file ] );
          const name = 'sampler' + actualLayer.textures.size;
          const url = URL.createObjectURL( blob );
          actualLayer.createTexture( name, url );
          dispatch( {
            type: 'ShaderManager/AddLayerTexture',
            layerIndex,
            name,
            url
          } );
        } );
      }
    }
  };

  return (
    <Root className={ className }
      onDragOver={ handleDragOver }
      onDrop={ handleDrop }
    >
      { ( ( layerIndex != null ) && layer ) ? (
        <TexturesContainer>
          { Array.from( layer.textures ).map( ( [ name, { url } ] ) => <StyledTexture
            key={ name }
            layerIndex={ layerIndex }
            name={ name }
            src={ url }
          /> ) }
        </TexturesContainer>
      ) : null }
    </Root>
  );
};
