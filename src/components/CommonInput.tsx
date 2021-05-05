import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import styled from 'styled-components';

export const CommonInput = styled.input`
  display: block;
  width: 3rem;
  height: 12px;
  padding: 2px;
  text-align: right;
  font-size: 12px;
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
