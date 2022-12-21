import React, { useEffect } from 'react';
import { SHADERMAN } from '../ShaderManager';
import { ShaderManagerLayer } from '../ShaderManagerLayer';
import { ShaderManagerTexture } from '../ShaderManagerTexture';
import { useDispatch } from '../states/store';

// == component ====================================================================================
export const ShaderManagerStateListener: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      const addLayer = ( { index, layer }: { index: number; layer: ShaderManagerLayer } ): void => {
        const layerId = layer.id;

        const addTexture = (
          { index, texture }: { index: number; texture: ShaderManagerTexture }
        ): void => {
          const textureId = texture.id;

          dispatch( {
            type: 'ShaderManager/AddLayerTexture',
            layerId,
            textureId,
            index,
            name: texture.name,
            url: texture.url,
            wrap: texture.wrap,
            filter: texture.filter,
          } );

          texture.on( 'load', ( { url } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureUrl',
              layerId,
              textureId,
              url,
            } );
          } );

          texture.on( 'changeName', ( { name } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureName',
              layerId,
              textureId,
              name,
            } );
          } );

          texture.on( 'changeWrap', ( { wrap } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureWrap',
              layerId,
              textureId,
              wrap,
            } );
          } );

          texture.on( 'changeFilter', ( { filter } ) => {
            dispatch( {
              type: 'ShaderManager/ChangeLayerTextureFilter',
              layerId,
              textureId,
              filter,
            } );
          } );
        };

        dispatch( {
          type: 'ShaderManager/AddLayer',
          layerId,
          index,
          name: layer.name,
          code: layer.code ?? '',
        } );

        layer.on( 'changeName', ( { name } ) => {
          dispatch( {
            type: 'ShaderManager/ChangeLayerName',
            layerId,
            name,
          } );
        } );

        layer.on( 'addTexture', addTexture );

        layer.textures.forEach( ( texture, index ) => {
          addTexture( { texture, index } );
        } );

        layer.on( 'deleteTexture', ( { texture } ) => {
          dispatch( {
            type: 'ShaderManager/DeleteLayerTexture',
            layerId,
            textureId: texture.id,
          } );
        } );

        layer.on( 'compileShader', ( { code } ) => {
          dispatch( {
            type: 'ShaderManager/ChangeLayerCode',
            layerId,
            code,
          } );
        } );

        layer.on( 'gpuTime', ( { frame, median } ) => {
          dispatch( {
            type: 'ShaderManager/UpdateLayerGPUTime',
            layerId,
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

      SHADERMAN.on( 'changeScreenLayer', ( { layer } ) => {
        dispatch( {
          type: 'ShaderManager/ChangeScreenLayer',
          layerId: layer?.id ?? null,
        } );
      } );

      SHADERMAN.on( 'play', () => {
        dispatch( {
          type: 'ShaderManager/SetIsPlaying',
          isPlaying: true,
        } );
      } );

      SHADERMAN.on( 'pause', () => {
        dispatch( {
          type: 'ShaderManager/SetIsPlaying',
          isPlaying: false,
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

      SHADERMAN.on( 'deleteLayer', ( { layer } ) => {
        dispatch( {
          type: 'ShaderManager/DeleteLayer',
          layerId: layer.id,
        } );
      } );

      SHADERMAN.on( 'changeResolution', ( { width, height } ) => {
        dispatch( {
          type: 'ShaderManager/ChangeResolution',
          width,
          height,
        } );
      } );

      SHADERMAN.on( 'loadPreset', ( { preset } ) => {
        const layer = SHADERMAN.layers
          .find( ( layer ) => layer.name === preset.selectedLayer )
          ?? SHADERMAN.layers[ 0 ];
        const layerId = layer.id;

        dispatch( {
          type: 'ShaderManager/SelectLayer',
          layerId,
        } );
      } );
    },
    [],
  );

  return <></>;
};
