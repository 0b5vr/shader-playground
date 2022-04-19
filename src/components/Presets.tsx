import React, { useCallback } from 'react';
import { Colors } from '../constants/Colors';
import { Metrics } from '../constants/Metrics';
import { SHADERMAN } from '../ShaderManager';
import { ShaderManagerPreset } from '../ShaderManagerPreset';
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
const SelectPresets = styled.select`
  display: block;
  height: 20px;
  padding: 2px;
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
  font-weight: ${ Metrics.fontWeightNormal };
  background: ${ Colors.back1 };
  border: none;
  border-radius: calc( 0.5 * ${ Metrics.genericBorderRadius } );
  color: ${ Colors.fore };
`;

const Root = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
`;

// == element ======================================================================================
export const Presets: React.FC = () => {
  const handleChangePresets = useCallback(
    async ( event: React.ChangeEvent<HTMLSelectElement> ): Promise<void> => {
      const value = event.target.value;
      if ( value !== '' ) {
        const preset = await importPreset( value );
        SHADERMAN.loadPreset( preset );
      }
    },
    []
  );

  return <>
    <Root>
      <SelectPresets
        onChange={ handleChangePresets }
      >
        <option value=''>Presets</option>
        <option value=''>========</option>
        { Array.from( Object.keys( presets ) ).map( ( key ) => (
          <option key={ key }
            value={ key }
          >
            { key }
          </option>
        ) ) }
      </SelectPresets>
    </Root>
  </>;
};
