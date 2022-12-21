import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import { CommonInput } from './CommonInput';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';
import { useSelector } from '../states/store';

// == styles =======================================================================================
const Button = styled.button`
  margin-left: 16px;
  padding: 2px 8px;
  width: 60px;
  text-align: center;
  color: ${ Colors.fore };
  background: ${ Colors.back1 };
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  border: none;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
  }

  & + & {
    margin-left: 4px;
  }
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
  const { isPlaying, time, deltaTime, frame } = useSelector( ( state ) => ( {
    isPlaying: state.shaderManager.isPlaying,
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

  const handleClickPlay = useCallback(
    () => {
      SHADERMAN.play();
    },
    [],
  );

  const handleClickPause = useCallback(
    () => {
      SHADERMAN.pause();
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
      <Div>
        <Button onClick={ handleClickPlay } disabled={ isPlaying }>
          Play
        </Button>
        <Button onClick={ handleClickPause } disabled={ !isPlaying }>
          Pause
        </Button>
        <Button onClick={ handleClickRewind }>
          Rewind
        </Button>
      </Div>
    </Root>
  </>;
};
