export function registerMouseEvent(
  move: ( event: MouseEvent, movementSum: { x: number; y: number } ) => void,
  up?: ( event: MouseEvent ) => void
): void {
  let shouldUpdate = true;
  let moveEvent: MouseEvent | undefined;
  let movementSum = { x: 0.0, y: 0.0 };

  const update = (): void => {
    if ( !shouldUpdate ) { return; }
    requestAnimationFrame( update );

    if ( moveEvent ) {
      move( moveEvent, movementSum );
      moveEvent = undefined;
      movementSum = { x: 0.0, y: 0.0 };
    }
  };
  update();

  const movet = ( event: MouseEvent ): void => {
    moveEvent = event;
    movementSum.x += event.movementX;
    movementSum.y += event.movementY;
  };

  const upt = ( event: MouseEvent ): void => {
    up && up( event );
    shouldUpdate = false;
    window.removeEventListener( 'mousemove', movet );
    window.removeEventListener( 'mouseup', upt );
    window.removeEventListener( 'mousedown', upt );
  };

  window.addEventListener( 'mousemove', movet );
  window.addEventListener( 'mouseup', upt );
  setTimeout( () => window.addEventListener( 'mousedown', upt ) );
}
