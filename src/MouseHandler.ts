import { EventEmittable } from './utils/EventEmittable';

interface MouseHandlerEvents {
  move: { x: number; y: number };
}

export class MouseHandler extends EventEmittable<MouseHandlerEvents> {
  private __element: HTMLElement;

  public constructor( element: HTMLElement ) {
    super();

    this.__element = element;

    this.__element.addEventListener( 'mousemove', ( event ) => {
      event.preventDefault();

      const rect = this.__element.getBoundingClientRect();
      const x = ( event.clientX - rect.x ) / rect.width;
      const y = ( event.clientY - rect.y ) / rect.height;

      this.__emit( 'move', { x, y } );
    } );

    this.__element.addEventListener( 'touchmove', ( event ) => {
      event.preventDefault();

      const rect = this.__element.getBoundingClientRect();
      const x = ( event.touches[ 0 ].clientX - rect.x ) / rect.width;
      const y = ( event.touches[ 0 ].clientY - rect.y ) / rect.height;

      this.__emit( 'move', { x, y } );
    } );
  }
}
