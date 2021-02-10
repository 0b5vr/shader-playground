/* eslint-env node */

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';

export default ( env: any, argv: any ): webpack.Configuration => {
  const isProd = argv.mode === 'production';

  const banner = isProd
    ? '(c) 2019 FMS_Cat - https://github.com/FMS-Cat/shader-playground/blob/master/LICENSE'
    : `shader-playground v${require( './package.json' ).version}

Copyright (c) 2019 FMS_Cat
shader-playground is distributed under the MIT License
https://github.com/FMS-Cat/shader-playground/blob/master/LICENSE`;

  return {
    mode: argv.mode,
    entry: path.resolve( __dirname, 'src', 'index.tsx' ),
    output: {
      path: path.resolve( __dirname, 'dist' ),
      filename: 'shader-playground.js',
      library: 'vrm',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/i,
          use: {
            loader: 'file-loader',
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
        {
          test: /\.(frag|vert)$/,
          use: 'raw-loader',
        },
      ],
    },
    resolve: {
      extensions: [ '.js', '.ts', '.json', '.tsx' ],
      modules: [ 'node_modules' ],
    },
    devServer: {
      port: 4000,
      contentBase: path.resolve( __dirname, './' ),
      publicPath: '/dist/',
      openPage: 'examples/index.html',
      watchContentBase: true,
      inline: true,
    },
    plugins: [
      new webpack.BannerPlugin( banner ),
      // new webpack.DefinePlugin( { 'process.env': { NODE_ENV: argv.mode } } ),
      new HtmlWebpackPlugin( {
        template: './src/index.html'
      } ),
      ...( isProd ? [] : [ new ForkTsCheckerWebpackPlugin( { checkSyntacticErrors: true } ) ] ),
    ],
    devtool: isProd ? false : 'inline-source-map',
  };
};
