import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import { Layer } from './Layer';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const TexturesContainer = styled.div`
  width: 256px;
`;

const PlusH = styled.div`
  position: absolute;
  top: 8px;
  width: 24px;
  height: 8px;
  background: ${ Colors.back1 };
`;

const PlusV = styled.div`
  position: absolute;
  left: 8px;
  width: 8px;
  height: 24px;
  background: ${ Colors.back1 };
`;

const Plus = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`;

const ButtonAdd = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: ${ Colors.back3 };
  }
`;

const Root = styled.div`
  background: ${ Colors.back2 };
`;

// == element ======================================================================================
export const Layers: React.FC = () => {
  const { layerIds, layerCount } = useSelector( ( state ) => {
    const layerIds = state.shaderManager.layers.map( ( layer ) => layer.id );
    const layerCount = layerIds.length;

    return { layerIds, layerCount };
  } );

  const handleClickAdd = useCallback( () => {
    SHADERMAN.createLayer( 'layer' + layerCount );
  }, [ layerCount ] );

  return (
    <Root>
      <TexturesContainer>
        { layerIds.map( ( layerId ) => <Layer
          key={ layerId }
          layerId={ layerId }
        /> ) }
        <ButtonAdd onClick={ handleClickAdd }>
          <Plus>
            <PlusH />
            <PlusV />
          </Plus>
        </ButtonAdd>
      </TexturesContainer>
    </Root>
  );
};
