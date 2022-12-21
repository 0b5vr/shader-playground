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
interface Props {
  layerId: string;
  textureId: string;
  className?: string;
}

export const Texture: React.FC<Props> = ( { className, layerId, textureId } ) => {
  const { name, url, wrap, filter } = useSelector( ( state ) => {
    const layer = state.shaderManager.layers.find( ( layer ) => layer.id === layerId )!;
    const texture = layer.textures.find( ( texture ) => texture.id === textureId )!;
    const { name, url, wrap, filter } = texture;
    return { name, url, wrap, filter };
  } );

  const handleChangeName = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      const actualLayer = SHADERMAN.layers.find( ( layer ) => layer.id === layerId )!;
      const actualTexture = actualLayer.textures.find( ( texture ) => texture.id === textureId )!;
      actualTexture.name = event.target.value;
    },
    [ layerId, textureId ],
  );

  const handleChangeWrap = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const actualLayer = SHADERMAN.layers.find( ( layer ) => layer.id === layerId )!;
      const actualTexture = actualLayer.textures.find( ( texture ) => texture.id === textureId )!;
      actualTexture.wrap = event.target.value as ShaderManagerTextureWrap;
    },
    [ layerId, textureId ],
  );

  const handleChangeFilter = useCallback(
    ( event: React.ChangeEvent<HTMLSelectElement> ) => {
      const actualLayer = SHADERMAN.layers.find( ( layer ) => layer.id === layerId )!;
      const actualTexture = actualLayer.textures.find( ( texture ) => texture.id === textureId )!;
      actualTexture.filter = event.target.value as ShaderManagerTextureFilter;
    },
    [ layerId, textureId ],
  );

  const handleClickDelete = useCallback(
    () => {
      const actualLayer = SHADERMAN.layers.find( ( layer ) => layer.id === layerId )!;
      const textureIndex = actualLayer.textures.findIndex(
        ( texture ) => texture.id === textureId
      )!;
      actualLayer.deleteTexture( textureIndex );
    },
    [ layerId, name ]
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
