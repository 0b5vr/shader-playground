import { useDispatch, useSelector } from '../states/store';
import { CommonInput } from './CommonInput';
import React from 'react';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

// == styles =======================================================================================
const InputLabel = styled.div`
  margin-right: 0.5em;

  ${ CommonInput } + & {
    margin-left: 1em;
  }
`;

const Root = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
`;

// == element ======================================================================================
export const Resolution = (): JSX.Element => {
  const { width, height } = useSelector( ( state ) => ( {
    width: state.shaderManager.width,
    height: state.shaderManager.height,
  } ) );
  const dispatch = useDispatch();

  const handleChangeWidth = ( event: React.ChangeEvent<HTMLInputElement> ): void => {
    const value = event.target.value as any as number;
    if ( 0 < value ) {
      SHADERMAN.width = value;
      dispatch( {
        type: 'ShaderManager/ChangeResolution',
        width: SHADERMAN.width,
        height: SHADERMAN.height,
      } );
    }
  };

  const handleChangeHeight = ( event: React.ChangeEvent<HTMLInputElement> ): void => {
    const value = event.target.value as any as number;
    if ( 0 < value ) {
      SHADERMAN.height = value;
      dispatch( {
        type: 'ShaderManager/ChangeResolution',
        width: SHADERMAN.width,
        height: SHADERMAN.height,
      } );
    }
  };

  return <>
    <Root>
      <InputLabel>Width</InputLabel>
      <CommonInput
        type="number"
        value={ width }
        onChange={ handleChangeWidth }
      />
      <InputLabel>Height</InputLabel>
      <CommonInput
        type="number"
        value={ height }
        onChange={ handleChangeHeight }
      />
    </Root>
  </>;
};
