import { GLCat, GLCatBuffer } from '@fms-cat/glcat-ts';
import JSZip from 'jszip';
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

  private _isRecording = false;
  public get isRecording(): boolean {
    return this._isRecording;
  }

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

  public toBlob(): Promise<Blob> {
    if ( !this._canvas ) {
      throw new Error( 'Canvas is not attached' );
    }

    return new Promise( ( resolve, reject ) => {
      this._canvas!.toBlob( ( blob ) => {
        if ( blob == null ) {
          reject( new Error( 'Failed to get a blob; The result of canvas.toBlob() was null.' ) );
        } else {
          resolve( blob );
        }
      } );
    } );
  }

  /**
   * Return a zip as a blob.
   */
  public async record( {
    frames = 60,
    fps = 60
  } = {} ): Promise<Blob> {
    this._isRecording = true;

    const zip = new JSZip();

    const deltaTime = 1.0 / fps;
    for ( let iFrame = 0; iFrame < frames; iFrame ++ ) {
      const time = iFrame * deltaTime;
      this.render( { time, deltaTime } );
      const blob = await this.toBlob();
      const filename = String( iFrame ).padStart( 5, '0' ) + '.png';
      zip.file( filename, blob );
    }

    const blob = zip.generateAsync( { type: 'blob' } );

    this._isRecording = false;

    return blob;
  }

  public render( {
    time = undefined as ( number | undefined ),
    deltaTime = undefined as ( number | undefined )
  } = {} ): void {
    const prevTime = this._time;

    if ( time != null ) {
      this._time = time;
    } else {
      const now = 0.001 * Date.now();
      this._time = now - this._beginDate;
      if ( this._timeMod < this._time ) {
        this._time -= this._timeMod;
        this._beginDate += this._timeMod;
      }
    }

    if ( deltaTime != null ) {
      this._deltaTime = deltaTime;
    } else {
      this._deltaTime = this._time - prevTime;
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

    gl.flush();
  }
}

export const SHADERMAN = new ShaderManager();

function update(): void {
  requestAnimationFrame( update );

  if ( SHADERMAN.isReady && !SHADERMAN.isRecording ) {
    SHADERMAN.render();
  }
}
update();
