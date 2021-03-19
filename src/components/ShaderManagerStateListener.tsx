import React, { useEffect } from 'react';
import { SHADERMAN } from '../ShaderManager';
import { ShaderManagerLayer } from '../ShaderManagerLayer';
import { useDispatch } from '../states/store';

// == component ====================================================================================
export const ShaderManagerStateListener = (): JSX.Element => {
  const dispatch = useDispatch();

  useEffect(
    () => {
      const addLayer = ( { index, layer }: { index: number; layer: ShaderManagerLayer } ): void => {
        dispatch( {
          type: 'ShaderManager/AddLayer',
          layerIndex: index,
          code: layer.code ?? ''
        } );

        layer.on( 'addTexture', ( { name, url } ) => {
          dispatch( {
            type: 'ShaderManager/AddLayerTexture',
            layerIndex: index,
            name,
            url,
          } );
        } );

        layer.on( 'deleteTexture', ( { name } ) => {
          dispatch( {
            type: 'ShaderManager/DeleteLayerTexture',
            layerIndex: index,
            name,
          } );
        } );

        layer.on( 'compileShader', ( { code } ) => {
          dispatch( {
            type: 'ShaderManager/ChangeLayerCode',
            layerIndex: index,
            code,
          } );
        } );

        layer.on( 'gpuTime', ( { frame, median } ) => {
          dispatch( {
            type: 'ShaderManager/UpdateLayerGPUTime',
            layerIndex: index,
            gpuTime: {
              frame,
              median,
            },
          } );
        } );
      };

      SHADERMAN.on( 'addLayer', addLayer );

      SHADERMAN.layers.forEach( ( layer, index ) => {
        addLayer( { layer, index } );
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
