import * as ShaderManagerContext from '../contexts/ShaderManager';
import React, { useCallback, useContext, useState } from 'react';
import { Colors } from '../constants/Colors';
import { Contexts } from '../contexts/Contexts';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import { downloadBlob } from '../utils/downloadBlob';
import styled from 'styled-components';

// == styles =======================================================================================
const VL = styled.div`
  height: 24px;
  width: 2px;
  margin: 0 1em;
  background: ${ Colors.fore };
  opacity: 0.2;
`;

const Input = styled.input`
  display: block;
  width: 3rem;
  height: 0.8rem;
  padding: 0.1rem;
  text-align: right;
  font-size: 0.8rem;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  background: ${ Colors.back1 };
  border: none;
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  color: ${ Colors.fore };
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance:textfield;
`;

const InputLabel = styled.div`
  margin-right: 0.5em;

  ${ Input } + & {
    margin-left: 1em;
  }
`;

const ButtonRecord = styled.div<{ isRecording: boolean }>`
  margin-left: 16px;
  padding: 0.1rem 0.4rem;
  width: 4em;
  text-align: center;
  color: ${ ( { isRecording } ) => isRecording ? Colors.red : Colors.fore };
  background: ${ Colors.back2 };
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  cursor: pointer;

  &:active {
    opacity: 0.5;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0.5rem;
  width: calc( 100% - 1rem );
  height: calc( 100% - 1rem );
`;

const Root = styled.div`
  background: ${ Colors.back3 };
`;

// == element ======================================================================================
export interface HeaderProps {
  className?: string;
}

export const Header = ( { className }: HeaderProps ): JSX.Element => {
  const contexts = useContext( Contexts.Store );
  const [ fps, setFps ] = useState( 60 );
  const [ frames, setFrames ] = useState( 60 );

  const isRecording = contexts.state.shaderManager.isRecording;

  const handleChangeWidth = ( event: React.ChangeEvent<HTMLInputElement> ): void => {
    const value = event.target.value as any as number;
    if ( 0 < value ) {
      SHADERMAN.width = value;
      contexts.dispatch( {
        type: ShaderManagerContext.ActionType.ChangeResolution,
        width: SHADERMAN.width,
        height: SHADERMAN.height
      } );
    }
  };

  const handleChangeHeight = ( event: React.ChangeEvent<HTMLInputElement> ): void => {
    const value = event.target.value as any as number;
    if ( 0 < value ) {
      SHADERMAN.height = value;
      contexts.dispatch( {
        type: ShaderManagerContext.ActionType.ChangeResolution,
        width: SHADERMAN.width,
        height: SHADERMAN.height
      } );
    }
  };

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
      if ( contexts.state.shaderManager.isRecording ) {
        return;
      }

      contexts.dispatch( {
        type: ShaderManagerContext.ActionType.StartRecording
      } );
      const blob = await SHADERMAN.record( { fps, frames } );
      downloadBlob( blob, Date.now() + '.zip' );
      contexts.dispatch( {
        type: ShaderManagerContext.ActionType.EndRecording
      } );
    },
    [ isRecording, fps, frames ]
  );

  return <>
    <Root className={ className }>
      <Container>
        <InputLabel>W</InputLabel>
        <Input
          type="number"
          value={ contexts.state.shaderManager.width }
          onChange={ handleChangeWidth }
        />
        <InputLabel>H</InputLabel>
        <Input
          type="number"
          value={ contexts.state.shaderManager.height }
          onChange={ handleChangeHeight }
        />
        <VL />
        <InputLabel>Frames</InputLabel>
        <Input
          type="number"
          value={ frames }
          onChange={ handleChangeFrames }
        />
        <InputLabel>FPS</InputLabel>
        <Input
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
      </Container>
    </Root>
  </>;
};
