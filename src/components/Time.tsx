import React, { useCallback } from 'react';
import { CommonInput } from './CommonInput';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Button = styled.div`
  font-size: 12px;
  cursor: pointer;
`;

const Div = styled.div`
  display: flex;
  align-items: center;

  & + & {
    padding-top: 4px;
  }
`;

const Root = styled.div`
  padding: 8px;
`;

// == element ======================================================================================
export const Time: React.FC = () => {
  const { time, deltaTime, frame } = useSelector( ( state ) => ( {
    time: state.shaderManager.time,
    deltaTime: state.shaderManager.deltaTime,
    frame: state.shaderManager.frame,
  } ) );
  const timeMod = useSelector( ( state ) => state.shaderManager.timeMod );

  const handleChangeTimeMod = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ): void => {
      const value = parseFloat( event.target.value );
      if ( 0 < value ) {
        SHADERMAN.setTimeMod( value );
      }
    },
    [],
  );

  const handleClickRewind = useCallback(
    () => {
      SHADERMAN.rewind();
    },
    [],
  );

  return <>
    <Root>
      <Div>Time: { time.toFixed( 3 ) }</Div>
      <Div>DeltaTime: { deltaTime.toFixed( 3 ) }</Div>
      <Div>Frame: { frame }</Div>
      <Div>TimeMod: <CommonInput
        type="number"
        value={ timeMod }
        onChange={ handleChangeTimeMod }
      /></Div>
      <Button onClick={ handleClickRewind }>
        ⏪
      </Button>
    </Root>
  </>;
};
