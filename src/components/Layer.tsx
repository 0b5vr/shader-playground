import React, { useCallback } from 'react';
import { useDispatch, useSelector } from '../states/store';
import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

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

const Check = styled.input``;

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

const Root = styled.div<{ isSelected: boolean }>`
  position: relative;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  background: ${ ( { isSelected } ) => isSelected ? Colors.accent + '44' : 'transparent' };
  border-bottom: 1px solid ${ Colors.back3 };
`;

// == element ======================================================================================
interface Props {
  layerId: string;
}

export const Layer: React.FC<Props> = ( { layerId } ) => {
  const { isSelected, isScreen } = useSelector( ( state ) => ( {
    isSelected: state.shaderManager.selectedLayerId === layerId,
    isScreen: state.shaderManager.screenLayerId === layerId,
  } ) );
  const { name } = useSelector( ( state ) => {
    const layer = state.shaderManager.layers.find( ( layer ) => layer.id === layerId );
    const name = layer!.name;
    return { name };
  } );
  const dispatch = useDispatch();

  const handleClick = useCallback( () => {
    dispatch( {
      type: 'ShaderManager/SelectLayer',
      layerId,
    } );
  }, [ layerId ] );

  const handleChangeName = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ) => {
      const layer = SHADERMAN.layers.find( ( layer ) => layer.id === layerId );
      layer!.name = event.target.value;
    },
    [ layerId ],
  );

  const handleClickScreenCheck = useCallback(
    ( event: React.MouseEvent ) => {
      event.stopPropagation();
    },
    [],
  );

  const handleChangeScreenCheck = useCallback(
    () => {
      const layerIndex = SHADERMAN.layers.findIndex( ( layer ) => layer.id === layerId );

      if ( isScreen ) {
        SHADERMAN.setScreenLayer( -1 );
      } else {
        SHADERMAN.setScreenLayer( layerIndex );
      }
    },
    [ layerId, isScreen ]
  );

  const handleClickDelete = useCallback(
    () => {
      const layerIndex = SHADERMAN.layers.findIndex( ( layer ) => layer.id === layerId );

      SHADERMAN.deleteLayer( layerIndex );
    },
    [ layerId ],
  );

  return <>
    <Root isSelected={ isSelected }
      onClick={ handleClick }
    >
      <Info>
        <Name value={ name } onChange={ handleChangeName } />
        <Options>
          Screen: <Check type="checkbox"
            checked={ isScreen }
            onClick={ handleClickScreenCheck }
            onChange={ handleChangeScreenCheck }
          />
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
