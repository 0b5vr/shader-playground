/* eslint-disable react/jsx-key */

import React, { useCallback, useState } from 'react';
import { Pane } from './Pane';
import { Performance } from './Performance';
import { Presets } from './Presets';
import { Record } from './Record';
import { Resolution } from './Resolution';
import { Textures } from './Textures';

// == element ======================================================================================
const PaneList = (): JSX.Element => {
  const [ order, setOrder ] = useState( [
    'resolution',
    'record',
    'presets',
    'performance',
    'textures',
  ] );

  const handleClick = useCallback(
    ( event: React.MouseEvent, paneKey: string ) => {
      const newOrder = order.concat();
      newOrder.splice( order.indexOf( paneKey ), 1 );
      newOrder.push( paneKey );

      setOrder( newOrder );
    },
    [ order ]
  );

  const panes: { [ key: string ]: JSX.Element } = {
    'resolution': <Pane
      key="resolution"
      paneKey="resolution"
      title="Resolution"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 0 } }
    >
      <Resolution />
    </Pane>,
    'record': <Pane
      key="record"
      paneKey="record"
      title="Record"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 20 } }
    >
      <Record />
    </Pane>,
    'presets': <Pane
      key="presets"
      paneKey="presets"
      title="Presets"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 40 } }
    >
      <Presets />
    </Pane>,
    'performance': <Pane
      key="performance"
      paneKey="performance"
      title="Performance"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 60 } }
    >
      <Performance />
    </Pane>,
    'textures': <Pane
      key="textures"
      paneKey="textures"
      title="Textures"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 80 } }
    >
      <Textures />
    </Pane>,
  };

  return <>
    { order.map( ( paneKey ) => panes[ paneKey ] ) }
  </>;
};

export { PaneList };
