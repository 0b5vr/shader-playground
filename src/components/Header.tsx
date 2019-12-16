import * as ShaderManagerContext from '../contexts/ShaderManager';
import React, { useContext } from 'react';
import { Colors } from '../constants/Colors';
import { Contexts } from '../contexts/Contexts';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import styled from 'styled-components';

// == styles =======================================================================================
const ResoInput = styled.input`
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

const ResoInputLabel = styled.div`
  margin-right: 0.5em;

  ${ ResoInput } + & {
    margin-left: 1em;
  }
`;

const Container = styled.div`
  display: flex;
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

  return <>
    <Root className={ className }>
      <Container>
        <ResoInputLabel>W</ResoInputLabel>
        <ResoInput
          type="number"
          value={ contexts.state.shaderManager.width }
          onChange={ handleChangeWidth }
        />
        <ResoInputLabel>H</ResoInputLabel>
        <ResoInput
          type="number"
          value={ contexts.state.shaderManager.height }
          onChange={ handleChangeHeight }
        />
      </Container>
    </Root>
  </>;
};
