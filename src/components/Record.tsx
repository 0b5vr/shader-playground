import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from '../states/store';
import { Colors } from '../constants/Colors';
import { CommonInput } from './CommonInput';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import { downloadBlob } from '../utils/downloadBlob';
import styled from 'styled-components';

// == styles =======================================================================================
const InputLabel = styled.div`
  margin-right: 0.5em;

  ${ CommonInput } + & {
    margin-left: 1em;
  }
`;

const ButtonRecord = styled.div<{ isRecording: boolean }>`
  margin-left: 16px;
  padding: 2px 8px;
  width: 60px;
  text-align: center;
  color: ${ ( { isRecording } ) => isRecording ? Colors.red : Colors.fore };
  background: ${ Colors.back1 };
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  cursor: pointer;

  &:active {
    opacity: 0.5;
  }
`;

const Root = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
`;

// == element ======================================================================================
export const Record = (): JSX.Element => {
  const { isRecording } = useSelector( ( state ) => ( {
    isRecording: state.shaderManager.isRecording,
  } ) );
  const dispatch = useDispatch();

  const [ fps, setFps ] = useState( 60 );
  const [ frames, setFrames ] = useState( 60 );

  const handleChangeFrames = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ): void => {
      const value = event.target.value as any as number;
      if ( 0 < value ) {
        setFrames( Math.floor( value ) );
      }
    },
    []
  );

  const handleChangeFPS = useCallback(
    ( event: React.ChangeEvent<HTMLInputElement> ): void => {
      const value = event.target.value as any as number;
      if ( 0 < value ) {
        setFps( Math.floor( value ) );
      }
    },
    []
  );

  const handleClickButtonRecord = useCallback(
    async (): Promise<void> => {
      if ( isRecording ) { return; }

      dispatch( {
        type: 'ShaderManager/StartRecording',
      } );
      const blob = await SHADERMAN.record( { fps, frames } );
      downloadBlob( blob, Date.now() + '.zip' );
      dispatch( {
        type: 'ShaderManager/EndRecording',
      } );
    },
    [ isRecording, fps, frames ]
  );

  return <>
    <Root>
      <InputLabel>Frames</InputLabel>
      <CommonInput
        type="number"
        value={ frames }
        onChange={ handleChangeFrames }
      />
      <InputLabel>FPS</InputLabel>
      <CommonInput
        type="number"
        value={ fps }
        onChange={ handleChangeFPS }
      />
      <ButtonRecord
        isRecording={ isRecording }
        onClick={ handleClickButtonRecord }
      >
        { isRecording ? 'Wait' : 'Record' }
      </ButtonRecord>
    </Root>
  </>;
};
