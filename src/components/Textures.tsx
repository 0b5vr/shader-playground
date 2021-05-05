import { Colors } from '../constants/Colors';
import React from 'react';
import { SHADERMAN } from '../ShaderManager';
import { Texture } from './Texture';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const TexturesContainer = styled.div`
  width: 256px;
`;

const Margin = styled.div`
  height: 40px;
`;

const Root = styled.div`
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
          const name = 'sampler' + actualLayer.textures.length;
          const url = URL.createObjectURL( blob );
          actualLayer.loadTexture( name, url );
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
          { layer.textures.map( ( _, index ) => <Texture
            key={ index }
            layerIndex={ layerIndex }
            textureIndex={ index }
          /> ) }
          <Margin />
        </TexturesContainer>
      ) : null }
    </Root>
  );
};
