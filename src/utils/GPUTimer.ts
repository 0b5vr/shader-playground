import { Pool } from '../utils/Pool';

export interface GPUTimerOptions {
  queryPoolSize?: number;
}

export class GPUTimer {
  public gl: WebGL2RenderingContext;

  /**
   * EXT_disjoint_timer_query_webgl2
   */
  public ext: any;

  public queryPool: Pool<WebGLQuery>;
  public measureStack: Promise<number>[];

  public constructor( gl: WebGL2RenderingContext, options?: GPUTimerOptions ) {
    this.gl = gl;
    this.ext = gl.getExtension( 'EXT_disjoint_timer_query_webgl2' );

    const arrayQueries = new Array( options?.queryPoolSize ?? 256 )
      .fill( 1 )
      .map( () => gl.createQuery()! );
    this.queryPool = new Pool( arrayQueries );

    this.measureStack = [];
  }

  public async measure( func: () => void ): Promise<number> {
    const { gl, ext, queryPool } = this;

    if ( this.measureStack.length !== 0 ) {
      gl.endQuery( ext.TIME_ELAPSED_EXT );
      const promiseFinishingPrev = this.check( queryPool.current );

      this.measureStack = this.measureStack.map( async ( promiseAccum ) => {
        return ( await promiseAccum ) + ( await promiseFinishingPrev );
      } );
    }

    this.measureStack.push( Promise.resolve( 0.0 ) );

    gl.beginQuery( ext.TIME_ELAPSED_EXT, queryPool.next() );

    func();

    gl.endQuery( ext.TIME_ELAPSED_EXT );

    const promiseAccum = this.measureStack.pop()!;
    const promiseThis = this.check( queryPool.current );

    if ( this.measureStack.length !== 0 ) {
      this.measureStack = this.measureStack.map( async ( promiseAccum ) => {
        return ( await promiseAccum ) + ( await promiseThis );
      } );

      gl.beginQuery( ext.TIME_ELAPSED_EXT, queryPool.next() );
    }

    return ( await promiseAccum ) + ( await promiseThis );
  }

  public check( query: WebGLQuery ): Promise<number> {
    const { gl } = this;

    return new Promise( ( resolve ) => {
      const loop = (): void => {
        const isAvailable = gl.getQueryParameter( query, gl.QUERY_RESULT_AVAILABLE );

        if ( isAvailable ) {
          resolve( gl.getQueryParameter( query, gl.QUERY_RESULT ) * 0.001 * 0.001 );
        } else {
          setTimeout( loop, 1 );
        }
      };

      loop();
    } );
  }
}
