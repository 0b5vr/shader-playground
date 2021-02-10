import { GLCatProgram, GLCatTexture } from '@fms-cat/glcat-ts';
import { EventEmittable } from './utils/EventEmittable';
import { ShaderManager } from './ShaderManager';
import { applyMixins } from './utils/applyMixins';
import defaultFrag from './shaders/default.frag';
import defaultVert from './shaders/default.vert';

type ShaderManagerLayerTextures = Map<string, {
  url: string;
  texture: GLCatTexture;
}>;

export class ShaderManagerLayer {
  private _code?: string;
  public get code(): string | undefined { return this._code; }

  private _manager: ShaderManager;
  private _program?: GLCatProgram;

  private __textureMap: ShaderManagerLayerTextures = new Map();
  public get textures(): ShaderManagerLayerTextures { return this.__textureMap; }

  /**
   * Whether the layer can render or not.
   * If it returns `false`, you might want to call [[ShaderManagerLayer.compileShader]].
   */
  public get isReady(): boolean { return !!this._program; }

  /**
   * **DO NOT CALL THIS FUNCTION DIRECTLY!**
   *
   * Instantiate a [[ShaderManagerLayer]].
   *
   * @param manager The parent [[ShaderManager]]
   */
  public constructor( manager: ShaderManager ) {
    this._manager = manager;
    this.compileShader( defaultFrag );
  }

  public dispose(): void {
    this._program?.dispose( true );
    this.__textureMap.forEach( ( texture ) => {
      texture.texture.dispose();
    } );
  }

  public createTexture( name: string, url: string ): void {
    const gl = this._manager.gl;
    const glCat = this._manager.glCat;

    if ( !gl || !glCat ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    this.__textureMap.set( name, {
      url,
      texture: glCat.dummyTexture()!
    } );
    this.__emit( 'addTexture', { name, url } );

    const image = new Image();
    image.onload = () => {
      const texture = glCat.createTexture()!;
      texture.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
      texture.setTexture( image );
      this.__textureMap.set( name, {
        url,
        texture
      } );
    };
    image.src = url;
  }

  public deleteTexture( name: string ): void {
    const texture = this.__textureMap.get( name );

    if ( texture ) {
      texture.texture.dispose();
      this.__textureMap.delete( name );
    }
  }

  public compileShader( code: string ): void {
    const glCat = this._manager.glCat;

    if ( !glCat ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    try {
      const program = glCat.lazyProgram( defaultVert, code );

      if ( program ) {
        const prevProgram = this._program;
        this._program = program;
        this._code = code;

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
    const { time, deltaTime, width, height, gl, glCat } = this._manager;

    if ( !gl || !glCat ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    const program = this._program;

    if ( !program ) {
      throw new Error( '`ShaderManagerLayer.render`: You have to call `ShaderManagerLayer.compileShader` first' );
    }

    glCat.useProgram( program );

    program.attribute( 'p', this._manager.bufferQuad!, 2 );

    program.uniform1f( 'time', time );
    program.uniform1f( 'deltaTime', deltaTime );
    program.uniform2f( 'resolution', width, height );

    Array.from( this.__textureMap.entries() ).forEach( ( [ name, { texture } ], index ) => {
      program.uniformTexture( name, texture.raw, index );
    } );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
  }
}

export interface ShaderManagerLayerEvents {
  addTexture: { name: string; url: string };
  deleteTexture: { name: string };
  compileShader: { code: string; error?: any };
}

export interface ShaderManagerLayer extends EventEmittable<ShaderManagerLayerEvents> {}
applyMixins( ShaderManagerLayer, [ EventEmittable ] );
