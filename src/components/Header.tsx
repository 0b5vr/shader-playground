import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from '../states/store';
import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import { ShaderManagerPreset } from '../ShaderManagerPreset';
import { downloadBlob } from '../utils/downloadBlob';
import { presets } from '../presets';
import styled from 'styled-components';

// == utils ========================================================================================
async function importPreset( name: string ): Promise<ShaderManagerPreset> {
  const preset = presets[ name ];
  if ( !preset ) {
    throw new Error( 'Invalid preset name' );
  }

  return preset;
}

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

const SelectPresets = styled.select`
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
  const { isRecording, width, height } = useSelector( ( state ) => ( {
    isRecording: state.shaderManager.isRecording,
    width: state.shaderManager.width,
    height: state.shaderManager.height,
  } ) );
  const dispatch = useDispatch();

  const [ fps, setFps ] = useState( 60 );
  const [ frames, setFrames ] = useState( 60 );

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

  const handleChangePresets = useCallback(
    async ( event: React.ChangeEvent<HTMLSelectElement> ): Promise<void> => {
      const value = event.target.value;
      if ( value != null ) {
        const preset = await importPreset( value );
        SHADERMAN.loadPreset( preset );
      }
    },
    []
  );

  return <>
    <Root className={ className }>
      <Container>
        <InputLabel>W</InputLabel>
        <Input
          type="number"
          value={ width }
          onChange={ handleChangeWidth }
        />
        <InputLabel>H</InputLabel>
        <Input
          type="number"
          value={ height }
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
        <VL />
        <SelectPresets
          onChange={ handleChangePresets }
        >
          <option>Presets</option>
          <option>========</option>
          { Array.from( Object.keys( presets ) ).map( ( key ) => (
            <option key={ key }
              value={ key }
            >
              { key }
            </option>
          ) ) }
        </SelectPresets>
      </Container>
    </Root>
  </>;
};
