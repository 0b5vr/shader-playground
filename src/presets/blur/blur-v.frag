#define DIRECTION vec2(0.0, 1.0)
#define SIGMA 10.0
// #define REPEAT
#define MIRROR
#define SAMPLER layerBlurH

precision highp float;

const float PI = 3.14159265;

varying vec2 vUv;
uniform vec2 resolution;
uniform sampler2D SAMPLER;

float gaussian( float x ) {
  return 1.0 / sqrt( 2.0 * PI * SIGMA ) * exp( - x * x / 2.0 / SIGMA );
}

void main() {
  vec2 uv = vUv;
  vec2 deltaTexel = 1.0 / resolution;
  
  vec4 sum = vec4( 0.0 );
  
  for ( int i = -128; i < 128; i ++ ) {
    vec2 uvt = uv + deltaTexel * DIRECTION * float( i );
#if defined( REPEAT )
    uvt = fract( uvt );
#elif defined( MIRROR )
    uvt = 1.0 - abs( mod( uvt, vec2( 2.0 ) ) - 1.0 );
#else
    uvt = clamp( uvt, 0.0, 1.0 );
#endif
    float weight = gaussian( float( i ) );
    sum += weight * vec4( texture2D( SAMPLER, uvt ).rgb, 1.0 );
  }
  
  gl_FragColor = vec4( sum.rgb / sum.a, 1.0 );
}
