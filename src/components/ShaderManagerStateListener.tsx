import React, { useEffect } from 'react';
import { SHADERMAN } from '../ShaderManager';
import { ShaderManagerLayer } from '../ShaderManagerLayer';
import { ShaderManagerTexture } from '../ShaderManagerTexture';
import { useDispatch } from '../states/store';

// == component ====================================================================================
export const ShaderManagerStateListener = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      const addLayer = ( { index, layer }: { index: number; layer: ShaderManagerLayer } ): void => {
        const layerIndex = index;

        const addTexture = (
          { index, texture }: { index: number; texture: ShaderManagerTexture }
        ): void => {
          const textureIndex = index;

          dispatch( {
            type: 'ShaderManager/AddLayerTexture',
            layerIndex,
            textureIndex,
            name: texture.name,
            url: texture.url,
            wrap: texture.wrap,
            filter: texture.filter,
          } );

          texture.on( 'load', ( { url } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureUrl',
              layerIndex,
              textureIndex,
              url,
            } );
          } );

          texture.on( 'changeName', ( { name } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureName',
              layerIndex,
              textureIndex,
              name,
            } );
          } );

          texture.on( 'changeWrap', ( { wrap } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureWrap',
              layerIndex,
              textureIndex,
              wrap,
            } );
          } );

          texture.on( 'changeFilter', ( { filter } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureFilter',
              layerIndex,
              textureIndex,
              filter,
            } );
          } );
        };

        dispatch( {
          type: 'ShaderManager/AddLayer',
          layerIndex: index,
          name: layer.name,
          code: layer.code ?? '',
        } );

        layer.on( 'changeName', ( { name } ) => {
          dispatch( {
            type: 'ShaderManager/ChangeLayerName',
            layerIndex,
            name,
          } );
        } );

        layer.on( 'addTexture', addTexture );

        layer.textures.forEach( ( texture, index ) => {
          addTexture( { texture, index } );
        } );

        layer.on( 'deleteTexture', ( { index } ) => {
          dispatch( {
            type: 'ShaderManager/DeleteLayerTexture',
            layerIndex,
            textureIndex: index,
          } );
        } );

        layer.on( 'compileShader', ( { code } ) => {
          dispatch( {
            type: 'ShaderManager/ChangeLayerCode',
            layerIndex,
            code,
          } );
        } );

        layer.on( 'gpuTime', ( { frame, median } ) => {
          dispatch( {
            type: 'ShaderManager/UpdateLayerGPUTime',
            layerIndex,
            gpuTime: {
              frame,
              median,
            },
          } );
        } );
      };

      SHADERMAN.on( 'addLayer', addLayer );

      dispatch( {
        type: 'ShaderManager/ChangeTimeMod',
        timeMod: SHADERMAN.timeMod,
      } );

      SHADERMAN.layers.forEach( ( layer, index ) => {
        addLayer( { layer, index } );
      } );

      SHADERMAN.on( 'changeScreenLayer', ( { index } ) => {
        dispatch( {
          type: 'ShaderManager/ChangeScreenLayer',
          layerIndex: index,
        } );
      } );

      SHADERMAN.on( 'update', ( { time, deltaTime, frame } ) => {
        dispatch( {
          type: 'ShaderManager/UpdateTime',
          time,
          deltaTime,
          frame,
        } );
      } );

      SHADERMAN.on( 'changeTimeMod', ( { timeMod } ) => {
        dispatch( {
          type: 'ShaderManager/ChangeTimeMod',
          timeMod,
        } );
      } );

      SHADERMAN.on( 'deleteLayer', ( { index } ) => {
        dispatch( {
          type: 'ShaderManager/DeleteLayer',
          layerIndex: index,
        } );
      } );

      SHADERMAN.on( 'changeResolution', ( { width, height } ) => {
        dispatch( {
          type: 'ShaderManager/ChangeResolution',
          width,
          height,
        } );
      } );
    },
    [],
  );

  return <></>;
};
