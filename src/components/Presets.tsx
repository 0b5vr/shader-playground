import React, { useCallback } from 'react';
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
`;

const Root = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
`;

// == element ======================================================================================
export const Presets = (): JSX.Element => {
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
    <Root>
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
    </Root>
  </>;
};
