import React, { useCallback } from 'react';
import { ShaderManagerTextureFilter, ShaderManagerTextureWrap } from '../ShaderManagerTexture';
import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Name = styled.input`
  display: block;
  width: 96px;
  height: 12px;
  padding: 2px;
  text-align: left;
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  background: ${ Colors.back1 };
  border: none;
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  color: ${ Colors.fore };
  -moz-appearance:textfield;
`;

const SelectWrap = styled.select`
  display: block;
  height: 20px;
  padding: 2px;
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  background: ${ Colors.back1 };
  border: none;
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  color: ${ Colors.fore };
`;

const SelectFilter = styled.select`
  display: block;
  height: 20px;
  padding: 2px;
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  background: ${ Colors.back1 };
  border: none;
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  color: ${ Colors.fore };
  margin-left: 8px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
`;

const Info = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 12px;
  cursor: pointer;
`;

const Image = styled.div`
  width: 64px;
  height: 64px;
  overflow: hidden;
  flex-grow: 0;
  background-color: #000;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${ Colors.back3 };
`;

// == element ======================================================================================
export interface TextureProps {
  layerIndex: number;
  textureIndex: number;
  className?: string;
}

export const Texture = ( {
  className,
  layerIndex,
  textureIndex,
}: TextureProps ): JSX.Element => {
  const { name, url, wrap, filter } = useSelector( ( state ) => {
    const texture = state.shaderManager.layers[ layerIndex ].textures[ textureIndex ];
    const { name, url, wrap, filter } = texture;
    return { name, url, wrap, filter };
  } );

  const handleChangeName = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      const layer = SHADERMAN.layers[ layerIndex ];
      layer.textures[ textureIndex ].name = event.target.value;
    },
    [ layerIndex, textureIndex, name ]
  );

  const handleChangeWrap = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const layer = SHADERMAN.layers[ layerIndex ];
      layer.textures[ textureIndex ].wrap = event.target.value as ShaderManagerTextureWrap;
    },
    [ layerIndex, textureIndex, name ]
  );

  const handleChangeFilter = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const layer = SHADERMAN.layers[ layerIndex ];
      layer.textures[ textureIndex ].filter = event.target.value as ShaderManagerTextureFilter;
    },
    [ layerIndex, textureIndex, name ]
  );

  const handleClickDelete = useCallback(
    () => {
      const layer = SHADERMAN.layers[ layerIndex ];
      layer.deleteTexture( textureIndex );
    },
    [ layerIndex, name ]
  );

  return <>
    <Root className={ className }>
      <Image
        style={ {
          backgroundImage: `url(${ url })`
        } }
      ></Image>
      <Info>
        <Name value={ name } onChange={ handleChangeName } />
        <Options>
          <SelectWrap value={ wrap } onChange={ handleChangeWrap }>
            <option value="repeat">Repeat</option>
            <option value="clamp">Clamp</option>
          </SelectWrap>
          <SelectFilter value={ filter } onChange={ handleChangeFilter }>
            <option value="nearest">Nearest</option>
            <option value="linear">Linear</option>
            <option value="mipmap">Mipmap</option>
          </SelectFilter>
        </Options>
      </Info>
      <CloseButton
        onClick={ handleClickDelete }
      >
        ❌
      </CloseButton>
    </Root>
  </>;
};
