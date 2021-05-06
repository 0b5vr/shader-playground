#define AMP 0.1
#define SEED time

#define saturate(x) clamp(x,0.,1.)
#define lofi(x,d) (floor((x)/(d))*(d))

precision highp float;

varying vec2 vUv;
uniform sampler2D sampler0;
uniform sampler2D samplerRandom;
uniform float time;

vec3 rgb2yiq( vec3 rgb ) {
  return mat3( 0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312 ) * rgb;
}

vec3 yiq2rgb( vec3 yiq ) {
  return mat3( 1.000, 1.000, 1.000, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703 ) * yiq;
}

vec2 doDeform( vec2 uv ) {
  vec2 sum = vec2( 0.0 );
  float p = 1.0;
  for ( int i = 0; i < 4; i ++ ) {
    p *= 0.4;
    float offsetX = texture2D(
      samplerRandom,
      lofi( uv.y, 0.2 * p + 0.1 * SEED ) * vec2( 0.67, 0.83 )
    ).x;
    uv.x += offsetX;
    vec2 v = lofi( uv, vec2( 1.0, 0.2 ) * p );
    uv.y -= offsetX;
    vec4 tex = texture2D( samplerRandom, fract( v + 0.1 * SEED ) );
    sum += mix( 1.0 - AMP, 1.0, p ) < tex.z ? ( tex.xy - 0.5 ) * p : vec2( 0.0 );
  }
  return sum;
}

void main() {
  vec2 uv = vUv;
  vec2 deform = doDeform( uv );
  vec4 tex = vec4( 0.0 );
  tex.ra += texture2D( sampler0, fract( uv + 0.6 * deform ) ).ra;
  tex.ga += texture2D( sampler0, fract( uv + 0.8 * deform ) ).ga;
  tex.ba += texture2D( sampler0, fract( uv + 1.0 * deform ) ).ba;
  vec3 colYIQ = rgb2yiq( 1.0 * smoothstep( 0.0, 1.0, tex.rgb ) );
  colYIQ = colYIQ * mix(
    vec3( 1.1, 1.1, 0.8 ),
    vec3( 0.9, 0.5, 1.4 ),
    uv.y
  ) + mix(
    vec3( 0.01, -0.02, 0.02 ),
    vec3( 0.02, 0.03, 0.04 ),
    uv.y
  );

  vec3 col = yiq2rgb( colYIQ );

  gl_FragColor = vec4( col, saturate( tex.w ) );
}
