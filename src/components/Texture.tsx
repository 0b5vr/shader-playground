import * as LayersContext from '../contexts/Layers';
import React, { useCallback, useContext } from 'react';
import { Colors } from '../constants/Colors';
import { Contexts } from '../contexts/Contexts';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

// == styles =======================================================================================
const Name = styled.div`
  position: absolute;
  width: calc( 100% - 0.2rem );
  height: 0.8rem;
  left: 0;
  bottom: 0;
  padding: 0.1rem;
  font-size: 0.6rem;
  text-align: center;
  background-color: ${ Colors.fadeBlack8 };
`;

const CloseButton = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 12px;
  cursor: pointer;
`;

const Root = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${ Metrics.genericBorderRadius };
  background-color: #000;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

// == element ======================================================================================
export interface TextureProps {
  textureIndex: number;
  layerIndex: number;
  src: string;
  name: string;
  className?: string;
}

export const Texture = ( {
  className,
  layerIndex,
  textureIndex,
  name,
  src,
}: TextureProps ): JSX.Element => {
  const contexts = useContext( Contexts.Store );

  const handleClickDelete = useCallback(
    () => {
      const layer = SHADERMAN.layers[ layerIndex ];
      layer.deleteTexture( textureIndex );
      contexts.dispatch( {
        type: LayersContext.ActionType.DeleteTexture,
        layerIndex,
        textureIndex,
      } );
    },
    [ layerIndex, textureIndex ]
  );

  return <>
    <Root className={ className }
      style={ {
        backgroundImage: `url(${ src })`
      } }
    >
      <Name>{ name }</Name>
      <CloseButton
        onClick={ handleClickDelete }
      >
        ❌
      </CloseButton>
    </Root>
  </>;
};
