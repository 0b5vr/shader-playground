import { GLCat, GLCatBuffer } from '@fms-cat/glcat-ts';
import { ShaderManagerLayer } from './ShaderManagerLayer';

export class ShaderManager {
  private _time = 0.0;
  public get time(): number { return this._time; }

  private _deltaTime = 0.0;
  public get deltaTime(): number { return this._deltaTime; }

  private _timeMod = 300.0;
  public get timeMod(): number { return this._timeMod; }
  public set timeMod( mod: number ) {
    if ( mod <= 0.0 ) {
      throw new Error( 'timeMod does not accept negative numbers ?????? what' );
    }
    this._timeMod = mod;
  }

  private _canvas?: HTMLCanvasElement;
  public get canvas(): HTMLCanvasElement | undefined { return this._canvas; }

  private _gl?: WebGLRenderingContext;
  public get gl(): WebGLRenderingContext | undefined { return this._gl; }

  private _glCat?: GLCat;
  public get glCat(): GLCat | undefined { return this._glCat; }

  private _bufferQuad?: GLCatBuffer;
  public get bufferQuad(): GLCatBuffer | undefined { return this._bufferQuad; }

  private _layers: ShaderManagerLayer[] = [];
  public get layers(): ShaderManagerLayer[] { return this._layers; }

  public get width(): number { return this._canvas?.width || -1; }
  public set width( w: number ) {
    if ( !this._canvas ) {
      throw new Error( 'Canvas is not attached' );
    }
    this._canvas.width = w;
  }

  public get height(): number { return this._canvas?.height || -1; }
  public set height( h: number ) {
    if ( !this._canvas ) {
      throw new Error( 'Canvas is not attached' );
    }
    this._canvas.height = h;
  }

  private _beginDate = 0.001 * Date.now();
  private _handleResize?: () => void;

  public get isReady(): boolean {
    return !!this._canvas;
  }

  public attachCanvas( canvas: HTMLCanvasElement ): void {
    this._canvas = canvas;
    this._canvas.width = 256;
    this._canvas.height = 256;

    const gl = this._gl = this._canvas.getContext( 'webgl', { premultipliedAlpha: false } )!;
    const glCat = this._glCat = new GLCat( gl );

    this._bufferQuad = glCat.createBuffer()!;
    this._bufferQuad.setVertexbuffer( new Float32Array( [ -1, -1, 1, -1, -1, 1, 1, 1 ] ) );

    if ( this._handleResize ) {
      window.removeEventListener( 'resize', this._handleResize );
    }
    this._handleResize = () => {
      // TODO
    };
    window.addEventListener( 'resize', this._handleResize );
  }

  public createLayer(): ShaderManagerLayer {
    const layer = new ShaderManagerLayer( this );
    this._layers.push( layer );
    return layer;
  }

  public render(): void {
    const now = 0.001 * Date.now();
    const prevTime = this._time;
    this._time = now - this._beginDate;
    this._deltaTime = this._time - prevTime;
    if ( this._timeMod < this._time ) {
      this._time -= this._timeMod;
      this._beginDate += this._timeMod;
    }

    const canvas = this._canvas;
    const gl = this._gl;
    const glCat = this._glCat;

    if ( !canvas || !gl || !glCat ) {
      throw new Error( 'Canvas is not attached' );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    glCat.clear( 0.0, 0.0, 0.0, 0.0 );

    this._layers.forEach( ( layer ) => {
      if ( layer.isReady ) {
        layer.render();
      }
    } );
  }
}

export const SHADERMAN = new ShaderManager();

function update(): void {
  requestAnimationFrame( update );

  if ( SHADERMAN.isReady ) {
    SHADERMAN.render();
  }
}
update();
