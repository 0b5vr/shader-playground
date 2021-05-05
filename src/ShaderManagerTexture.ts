import { GLCat, GLCatTexture } from '@fms-cat/glcat-ts';
import { EventEmittable } from './utils/EventEmittable';
import { applyMixins } from './utils/applyMixins';

export type ShaderManagerTextureWrap = 'repeat' | 'clamp';

export type ShaderManagerTextureFilter = 'nearest' | 'linear' | 'mipmap';

export class ShaderManagerTexture {
  private __url?: string;
  public get url(): string | undefined {
    return this.__url;
  }

  private __texture: GLCatTexture;
  public get texture(): GLCatTexture {
    return this.__texture;
  }

  private __glCat: GLCat;
  public get glCat(): GLCat {
    return this.__glCat;
  }

  private __name: string;
  public get name(): string {
    return this.__name;
  }
  public set name( name: string ) {
    this.__name = name;

    this.__emit( 'changeName', { name } );
  }

  private __wrap: ShaderManagerTextureWrap;
  public get wrap(): ShaderManagerTextureWrap {
    return this.__wrap;
  }
  public set wrap( wrap: ShaderManagerTextureWrap ) {
    const glCat = this.__glCat;

    this.__wrap = wrap;

    this.__emit( 'changeWrap', { wrap } );

    if ( this.texture === glCat.dummyTexture ) {
      return;
    }

    const gl = glCat.gl;

    if ( wrap === 'repeat' ) {
      this.texture.textureWrap( gl.REPEAT );
    } else if ( wrap === 'clamp' ) {
      this.texture.textureWrap( gl.CLAMP_TO_EDGE );
    }
  }

  private __filter: ShaderManagerTextureFilter;
  public get filter(): ShaderManagerTextureFilter {
    return this.__filter;
  }
  public set filter( filter: ShaderManagerTextureFilter ) {
    const glCat = this.__glCat;

    this.__filter = filter;

    this.__emit( 'changeFilter', { filter } );

    if ( this.texture === glCat.dummyTexture ) {
      return;
    }

    const gl = glCat.gl;

    if ( filter === 'nearest' ) {
      this.texture.textureFilter( gl.NEAREST, gl.NEAREST );
    } else if ( filter === 'linear' ) {
      this.texture.textureFilter( gl.LINEAR, gl.LINEAR );
    } else if ( filter === 'mipmap' ) {
      this.texture.textureFilter( gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR );
      this.texture.bind( () => {
        gl.generateMipmap( gl.TEXTURE_2D );
      } );
    }
  }

  public constructor( glCat: GLCat, name: string ) {
    this.__glCat = glCat;
    this.__name = name;
    this.__texture = glCat.dummyTexture;
    this.__wrap = 'repeat';
    this.__filter = 'mipmap';
  }

  public dispose(): void {
    this.__texture.dispose();
  }

  public load( url: string ): void {
    const glCat = this.__glCat;
    const gl = glCat.gl;

    const image = new Image();
    image.onload = () => {
      const texture = glCat.createTexture()!;
      texture.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
      texture.setTexture( image );

      this.__url = url;
      this.__texture = texture;
      this.wrap = this.__wrap;
      this.filter = this.__filter;

      this.__emit( 'load', { url } );
    };
    image.src = url;
  }
}

export interface ShaderManagerTextureEvents {
  load: { url: string };
  changeName: { name: string };
  changeWrap: { wrap: ShaderManagerTextureWrap };
  changeFilter: { filter: ShaderManagerTextureFilter };
}

export interface ShaderManagerTexture extends EventEmittable<ShaderManagerTextureEvents> {}
applyMixins( ShaderManagerTexture, [ EventEmittable ] );
