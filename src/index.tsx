import { App } from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from './states/store';

const uiContainer = document.createElement( 'div' );
document.body.appendChild( uiContainer );

const store = createStore();

ReactDOM.render(
  <App store={ store } />,
  uiContainer
);
