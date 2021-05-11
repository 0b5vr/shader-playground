import { GLCat, GLCatBuffer } from '@fms-cat/glcat-ts';
import { EventEmittable } from './utils/EventEmittable';
import { GPUTimer } from './utils/GPUTimer';
import JSZip from 'jszip';
import { ShaderManagerLayer } from './ShaderManagerLayer';
import { ShaderManagerPreset } from './ShaderManagerPreset';
import { applyMixins } from './utils/applyMixins';

export class ShaderManager {
  private _time = 0.0;
  public get time(): number { return this._time; }

  private _deltaTime = 0.0;
  public get deltaTime(): number { return this._deltaTime; }

  private __frame = 0;
  public get frame(): number { return this.__frame; }

  private _timeMod = 300.0;
  public get timeMod(): number { return this._timeMod; }

  private _canvas?: HTMLCanvasElement;
  public get canvas(): HTMLCanvasElement | undefined { return this._canvas; }

  private _gl?: WebGLRenderingContext;
  public get gl(): WebGLRenderingContext | undefined { return this._gl; }

  private _glCat?: GLCat;
  public get glCat(): GLCat | undefined { return this._glCat; }

  private _gpuTimer?: GPUTimer;
  public get gpuTimer(): GPUTimer | undefined { return this._gpuTimer; }

  private _bufferQuad?: GLCatBuffer;
  public get bufferQuad(): GLCatBuffer | undefined { return this._bufferQuad; }

  private _layers: ShaderManagerLayer[] = [];
  public get layers(): ShaderManagerLayer[] { return this._layers; }

  private __screenLayer: ShaderManagerLayer | null = null;
  public get screenLayer(): ShaderManagerLayer | null {
    return this.__screenLayer;
  }

  public get width(): number { return this._canvas?.width || -1; }

  public get height(): number { return this._canvas?.height || -1; }

  private _beginDate = 0.001 * Date.now();
  private _handleResize?: () => void;

  private _isRecording = false;
  public get isRecording(): boolean {
    return this._isRecording;
  }

  public get isReady(): boolean {
    return !!this._canvas;
  }

  public rewind(): void {
    this._time = 0.0;
    this._beginDate = 0.001 * Date.now();
    this.__frame = 0;
  }

  public setTimeMod( timeMod: number ): void {
    if ( timeMod <= 0.0 ) {
      throw new Error( 'timeMod does not accept negative numbers ?????? what' );
    }
    this._timeMod = timeMod;

    this.__emit( 'changeTimeMod', { timeMod } );
  }

  public setResolution( width: number, height: number ): void {
    const canvas = this._canvas;

    if ( !canvas ) {
      throw new Error( 'Canvas is not attached' );
    }

    canvas.width = width;
    canvas.height = height;

    this._layers.forEach( ( layer ) => {
      layer.setResolution( width, height );
    } );

    this.__emit( 'changeResolution', { width, height } );
  }

  public attachCanvas( canvas: HTMLCanvasElement ): void {
    this._canvas = canvas;
    this._canvas.width = 256;
    this._canvas.height = 256;

    const gl = this._gl = this._canvas.getContext(
      'webgl2',
      { premultipliedAlpha: false, antialias: false }
    )!;
    const glCat = this._glCat = new GLCat( gl );
    this._gpuTimer = new GPUTimer( gl );
    gl.blendFunc( gl.ONE, gl.ZERO );

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

  /**
   * @param index -1 to unset
   */
  public setScreenLayer( index: number ): void {
    const layer = index !== -1 ? this._layers[ index ] : null;
    this.__screenLayer = layer;

    this.__emit( 'changeScreenLayer', { index, layer } );
  }

  public loadPreset( preset: ShaderManagerPreset ): void {
    this.clearLayers();

    this.setResolution( preset.width, preset.height );

    preset.layers.forEach( ( { name, code, textures } ) => {
      const layer = this.createLayer( name );
      layer.setResolution( preset.width, preset.height );
      layer.compileShader( code );

      textures?.forEach( ( { name, url, wrap, filter } ) => {
        const texture = layer.loadTexture( name, url );

        if ( wrap != null ) {
          texture.wrap = wrap;
        }

        if ( filter != null ) {
          texture.filter = filter;
        }
      } );
    } );

    this.setScreenLayer(
      preset.layers.findIndex( ( layer ) => layer.name === preset.screenLayer ),
    );

    this.rewind();
  }

  public createLayer( name: string ): ShaderManagerLayer {
    const layer = new ShaderManagerLayer( this, name );
    const index = this._layers.length;

    this._layers.push( layer );

    this.__emit( 'addLayer', { index, layer } );

    return layer;
  }

  public deleteLayer( index: number ): void {
    const layer = this._layers[ index ];

    if ( this.screenLayer === layer ) {
      this.setScreenLayer( -1 );
    }

    this._layers.splice( index, 1 );

    layer.dispose();

    this.__emit( 'deleteLayer', { index, layer } );
  }

  public clearLayers(): void {
    while ( this._layers.length > 0 ) {
      this.deleteLayer( 0 );
    }
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
    deltaTime = undefined as ( number | undefined ),
  } = {} ): void {
    const prevTime = this._time;

    if ( time != null ) {
      this._time = time;
    } else {
      const now = 0.001 * Date.now();
      this._time = now - this._beginDate;
      while ( this._timeMod < this._time ) {
        this._beginDate += this._timeMod;
        this._time = now - this._beginDate;
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

    this._layers.forEach( ( layer ) => {
      if ( layer.isReady ) {
        layer.render();
      }
    } );

    if ( this.__screenLayer != null ) {
      glCat.blitFramebuffer(
        this.__screenLayer.framebuffer,
        null,
        {
          srcViewport: [ 0, 0, canvas.width, canvas.height ],
          dstViewport: [ 0, 0, canvas.width, canvas.height ],
        }
      );
    }

    gl.flush();

    this.__emit( 'update', {
      time: this._time,
      deltaTime: this._deltaTime,
      frame: this.__frame,
    } );

    this.__frame ++;
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

export interface ShaderManagerEvents {
  update: { time: number; deltaTime: number; frame: number };
  changeTimeMod: { timeMod: number };
  changeResolution: { width: number; height: number };
  changeScreenLayer: { layer: ShaderManagerLayer | null; index: number };
  addLayer: { layer: ShaderManagerLayer; index: number };
  deleteLayer: { layer: ShaderManagerLayer; index: number };
}

export interface ShaderManager extends EventEmittable<ShaderManagerEvents> {}
applyMixins( ShaderManager, [ EventEmittable ] );
