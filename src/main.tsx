import { App } from './components/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore } from './states/store';

const store = createStore();

const root = createRoot( document.getElementById( 'root' )! );

root.render( <App store={ store } /> );
