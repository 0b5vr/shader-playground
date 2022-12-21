import { GLCatFramebuffer, GLCatProgram } from '@0b5vr/glcat-ts';
import { HistoryPercentileCalculator, Swap } from '@0b5vr/experimental';
import { EventEmittable } from './utils/EventEmittable';
import { ShaderManager } from './ShaderManager';
import { ShaderManagerTexture } from './ShaderManagerTexture';
import { applyMixins } from './utils/applyMixins';
import default3Vert from './shaders/default3.vert?raw';
import defaultFrag from './shaders/default.frag?raw';
import defaultVert from './shaders/default.vert?raw';
import { genID } from './utils/genID';

export class ShaderManagerLayer {
  public readonly id = genID();

  private _code?: string;
  public get code(): string | undefined { return this._code; }

  private __swap: Swap<GLCatFramebuffer>;
  public get framebuffer(): GLCatFramebuffer {
    return this.__swap.o;
  }

  private __samplersUsed: string[];
  private _manager: ShaderManager;
  private _program?: GLCatProgram;
  private __measureMedianCalc: HistoryPercentileCalculator;

  private __name: string;
  public get name(): string {
    return this.__name;
  }
  public set name( name: string ) {
    this.__name = name;

    this.__emit( 'changeName', { name } );
  }

  private _textures: ShaderManagerTexture[] = [];
  public get textures(): ShaderManagerTexture[] { return this._textures; }

  /**
   * Whether the layer can render or not.
   * If it returns `false`, you might want to call [[ShaderManagerLayer.compileShader]].
   */
  public get isReady(): boolean { return !!this._program; }

  /**
   * **DO NOT CALL THIS CONSTRUCTOR DIRECTLY!**
   * Intended to be called via {@link ShaderManager.createLayer}.
   *
   * Instantiate a [[ShaderManagerLayer]].
   *
   * @param manager The parent [[ShaderManager]]
   */
  public constructor( manager: ShaderManager, name: string ) {
    this._manager = manager;
    this.__name = name;
    this.__samplersUsed = [];
    this.compileShader( defaultFrag );

    this.__swap = this.__createSwap( manager.width, manager.height );

    this.__measureMedianCalc = new HistoryPercentileCalculator( 60 );
  }

  public dispose(): void {
    this._program?.dispose( true );
    this.clearTextures();
  }

  public setResolution( width: number, height: number ): void {
    this.__swap.i.dispose( true );
    this.__swap.o.dispose( true );

    this.__swap = this.__createSwap( width, height );

    this.__emit( 'changeResolution', { width, height } );
  }

  public loadTexture( name: string, url: string, index?: number ): ShaderManagerTexture {
    const glCat = this._manager.glCat;

    if ( !glCat ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    const texture = new ShaderManagerTexture( glCat, name );
    texture.load( url );

    index = index ?? this._textures.length;
    this._textures[ index ] = texture;

    this.__emit( 'addTexture', { texture, index } );

    return texture;
  }

  public deleteTexture( index: number ): void {
    const texture = this._textures[ index ];

    this._textures.splice( index, 1 );

    texture.dispose();

    this.__emit( 'deleteTexture', { texture, index } );
  }

  public clearTextures(): void {
    while ( this._textures.length > 0 ) {
      this.deleteTexture( 0 );
    }
  }

  public compileShader( code: string ): void {
    const glCat = this._manager.glCat;

    if ( !glCat ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    try {
      const isES3 = code.startsWith( '#version 300 es' );
      const program = glCat.lazyProgram(
        isES3 ? default3Vert : defaultVert,
        code,
      );

      if ( program ) {
        const prevProgram = this._program;
        this._program = program;
        this._code = code;
        this.__samplersUsed = this.__getSamplersUsed( program );

        if ( prevProgram ) {
          prevProgram.shaders!.forEach( ( shader ) => shader.dispose() );
          prevProgram.dispose();
        }
      }

      this.__emit( 'compileShader', { code } );
    } catch ( error ) {
      console.error( error );

      this.__emit( 'compileShader', { code, error } );

      return;
    }
  }

  public render(): void {
    const { frame, time, deltaTime, width, height, gl, glCat, gpuTimer } = this._manager;
    const mousePosition = this._manager.mousePosition;

    if ( !gl || !glCat || !gpuTimer ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    const program = this._program;

    if ( !program ) {
      throw new Error( '`ShaderManagerLayer.render`: You have to call `ShaderManagerLayer.compileShader` first' );
    }

    gpuTimer.measure( () => {
      glCat.useProgram( program );

      program.attribute( 'p', this._manager.bufferQuad!, 2 );

      program.uniform( 'frame', '1i', frame );
      program.uniform( 'time', '1f', time );
      program.uniform( 'deltaTime', '1f', deltaTime );
      program.uniform( 'resolution', '2f', width, height );
      program.uniform( 'mouse', '2f', mousePosition.x, 1.0 - mousePosition.y );

      this._textures.forEach( ( { name, texture } ) => {
        if ( this.__samplersUsed.indexOf( name ) !== -1 ) {
          program.uniformTexture( name, texture );
        }
      } );

      this._manager.layers.forEach( ( { name, framebuffer } ) => {
        if ( this.__samplersUsed.indexOf( name ) !== -1 ) {
          program.uniformTexture( name, framebuffer.texture! );
        }
      } );

      glCat.bindFramebuffer( this.__swap.i, () => {
        glCat.clear( 0, 0, 0, 0 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      } );

      this.__swap.swap();
    } ).then( ( time ) => {
      this.__measureMedianCalc.push( time );

      this.__emit( 'gpuTime', {
        frame: time,
        median: this.__measureMedianCalc.median,
      } );
    } );
  }

  private __createSwap( width: number, height: number ): Swap<GLCatFramebuffer> {
    const glCat = this._manager.glCat;

    if ( !glCat ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    return new Swap(
      glCat.lazyFramebuffer( width, height, { isFloat: true } ),
      glCat.lazyFramebuffer( width, height, { isFloat: true } ),
    );
  }

  private __getSamplersUsed( program: GLCatProgram ): string[] {
    const gl = this._manager.gl;

    if ( !gl ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    const result: string[] = [];

    const numUniforms = gl.getProgramParameter( program.raw, gl.ACTIVE_UNIFORMS );
    for ( let i = 0; i < numUniforms; i ++ ) {
      const info = gl.getActiveUniform( program.raw, i )!;
      if ( info.type === gl.SAMPLER_2D ) {
        result.push( info.name );
      }
    }

    return result;
  }
}

export interface ShaderManagerLayerEvents {
  changeName: { name: string };
  changeResolution: { width: number; height: number };
  gpuTime: { frame: number; median: number };
  addTexture: { texture: ShaderManagerTexture; index: number };
  deleteTexture: { texture: ShaderManagerTexture; index: number };
  compileShader: { code: string; error?: any };
}

export interface ShaderManagerLayer extends EventEmittable<ShaderManagerLayerEvents> {}
applyMixins( ShaderManagerLayer, [ EventEmittable ] );
