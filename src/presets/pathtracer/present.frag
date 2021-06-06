#version 300 es

// #define COMPARE

precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform sampler2D layerAccumulate;
uniform sampler2D samplerReference;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tex = texture( layerAccumulate, uv );

#ifdef COMPARE
  if ( mouse.x > uv.x ) {
    fragColor = texture( samplerReference, uv );
    return;
  }
#endif // COMPARE

  vec3 color = tex.rgb / tex.a;
  color = pow( color, vec3( 0.4545 ) );

  fragColor = vec4( color, 1 );
}
