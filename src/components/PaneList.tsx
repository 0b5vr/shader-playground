/* eslint-disable react/jsx-key */

import React, { useCallback, useState } from 'react';
import { Layers } from './Layers';
import { Pane } from './Pane';
import { Performance } from './Performance';
import { Presets } from './Presets';
import { Record } from './Record';
import { Resolution } from './Resolution';
import { Textures } from './Textures';
import { Time } from './Time';

// == element ======================================================================================
const PaneList: React.FC = () => {
  const [ order, setOrder ] = useState( [
    'time',
    'resolution',
    'record',
    'presets',
    'performance',
    'layers',
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

  const panes: { [ key: string ]: React.ReactNode } = {
    'time': <Pane
      key="time"
      paneKey="time"
      title="Time"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 0 } }
    >
      <Time />
    </Pane>,
    'resolution': <Pane
      key="resolution"
      paneKey="resolution"
      title="Resolution"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 20 } }
    >
      <Resolution />
    </Pane>,
    'record': <Pane
      key="record"
      paneKey="record"
      title="Record"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 40 } }
    >
      <Record />
    </Pane>,
    'presets': <Pane
      key="presets"
      paneKey="presets"
      title="Presets"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 60 } }
    >
      <Presets />
    </Pane>,
    'performance': <Pane
      key="performance"
      paneKey="performance"
      title="Performance"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 80 } }
    >
      <Performance />
    </Pane>,
    'layers': <Pane
      key="layers"
      paneKey="layers"
      title="Layers"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 100 } }
    >
      <Layers />
    </Pane>,
    'textures': <Pane
      key="textures"
      paneKey="textures"
      title="Textures"
      onClick={ handleClick }
      initPosition={ { left: 0, top: 120 } }
    >
      <Textures />
    </Pane>,
  };

  return <>
    { order.map( ( paneKey ) => panes[ paneKey ] ) }
  </>;
};

export { PaneList };
