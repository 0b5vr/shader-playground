import * as LayersContext from '../contexts/Layers';
import React, { useContext } from 'react';
import { Colors } from '../constants/Colors';
import { Contexts } from '../contexts/Contexts';
import { Metrics } from '../constants/Metrics';
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
  const contexts = useContext( Contexts.Store );

  const handleDragOver = ( event: React.DragEvent ): void => {
    event.preventDefault();
  };

  const handleDrop = ( event: React.DragEvent ): void => {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if ( files ) {
      const index = contexts.state.layers.selectedIndex!;
      const layer = SHADERMAN.layers[ index ];
      Array.from( files ).forEach( ( file ) => {
        const blob = new Blob( [ file ] );
        const name = 'sampler' + layer.textures.length;
        const url = URL.createObjectURL( blob );
        layer.createTexture( name, url );
        contexts.dispatch( {
          type: LayersContext.ActionType.AddTexture,
          index,
          name,
          url
        } );
      } );
    }
  };

  const layerIndex = contexts.state.layers.selectedIndex!;
  const layer = contexts.state.layers.layers[ layerIndex ];

  return <>
    <Root className={ className }
      onDragOver={ handleDragOver }
      onDrop={ handleDrop }
    >
      <TexturesContainer>
        { layer?.textures?.map( ( texture, iTexture ) => <StyledTexture
          key={ iTexture }
          layerIndex={ layerIndex }
          textureIndex={ iTexture }
          name={ 'sampler' + iTexture }
          src={ texture.url }
        /> ) }
      </TexturesContainer>
    </Root>
  </>;
};
