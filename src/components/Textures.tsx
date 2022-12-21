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
interface Props {
  className?: string;
}

export const Textures: React.FC<Props> = ( { className } ) => {
  const { layerId, layer, textureIds } = useSelector( ( state ) => {
    const layerId = state.shaderManager.selectedLayerId;
    const layer = ( layerId != null )
      ? state.shaderManager.layers.find( ( layer ) => layer.id === layerId )
      : null;
    const textureIds = layer?.textures.map( ( texture ) => texture.id );

    return { layerId, layer, textureIds };
  } );

  const handleDragOver = ( event: React.DragEvent ): void => {
    event.preventDefault();
  };

  const handleDrop = ( event: React.DragEvent ): void => {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if ( files ) {
      const actualLayer = ( layerId != null )
        ? SHADERMAN.layers.find( ( layer ) => layer.id === layerId )
        : null;

      if ( layerId != null && actualLayer ) {
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
      { ( ( layerId != null ) && layer ) ? (
        <TexturesContainer>
          { textureIds?.map( ( textureId ) => <Texture
            key={ textureId }
            layerId={ layerId }
            textureId={ textureId }
          /> ) }
          <Margin />
        </TexturesContainer>
      ) : null }
    </Root>
  );
};
