import { GLCatProgram, GLCatTexture } from '@fms-cat/glcat-ts';
import { ShaderManager } from './ShaderManager';
import defaultFrag from './shaders/default.frag';
import defaultVert from './shaders/default.vert';

type ShaderManagerLayerTextures = Array<{
  url: string;
  texture: GLCatTexture;
}>;

export class ShaderManagerLayer {
  private _code?: string;
  public get code(): string | undefined { return this._code; }

  private _manager: ShaderManager;
  private _program?: GLCatProgram;

  private _textures: ShaderManagerLayerTextures = [];
  public get textures(): ShaderManagerLayerTextures { return this._textures; }

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

  public createTexture( name: string, url: string ): void {
    const gl = this._manager.gl;
    const glCat = this._manager.glCat;

    if ( !gl || !glCat ) {
      throw new Error( 'Canvas is not attached to the ShaderManager' );
    }

    const index = this._textures.length;
    this._textures[ index ] = {
      url,
      texture: glCat.dummyTexture()!
    };

    const image = new Image();
    image.onload = () => {
      const texture = glCat.createTexture()!;
      texture.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
      texture.setTexture( image );
      this._textures[ index ] = {
        url,
        texture
      };
    };
    image.src = url;
  }

  public deleteTexture( index: number ): void {
    const texture = this._textures[ index ];
    texture.texture.dispose();
    this._textures.splice( index, 1 );
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
    } catch ( e ) {
      console.error( e );
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

    this._textures.forEach( ( texture, index ) => {
      const name = 'sampler' + index;
      program.uniformTexture( name, texture.texture.raw, index );
    } );

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
  }
}
