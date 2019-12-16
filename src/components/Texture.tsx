import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import React from 'react';
import styled from 'styled-components';

// == styles =======================================================================================
const Name = styled.div`
  position: absolute;
  width: calc( 100% - 0.2rem );
  height: 0.8rem;
  left: 0;
  bottom: 0;
  padding: 0.1rem;
  font-size: 0.6rem;
  text-align: center;
  background-color: ${ Colors.fadeBlack8 };
`;

const Root = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${ Metrics.genericBorderRadius };
  background-color: #000;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

// == element ======================================================================================
export interface TextureProps {
  src: string;
  name: string;
  className?: string;
}

export const Texture = ( { className, name, src }: TextureProps ): JSX.Element => <>
  <Root className={ className }
    style={ {
      backgroundImage: `url(${ src })`
    } }
  >
    <Name>{ name }</Name>
  </Root>
</>;
