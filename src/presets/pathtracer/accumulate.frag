#version 300 es

// do not touch this layer!

precision highp float;

uniform int frame;
uniform vec2 resolution;
uniform sampler2D layerDraw;
uniform sampler2D layerAccumulate;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  // accumulate using backbuffer
  fragColor = texture( layerDraw, uv );

  if ( frame > 1 ) {
    fragColor += texture( layerAccumulate, uv );
  }
}
