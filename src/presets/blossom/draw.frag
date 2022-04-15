#version 300 es

// Blossom compatible template
// Blossom is a framework for creating 4k executable graphics, authored by yx
// https://github.com/lunasorcery/Blossom

// This is `draw.frag` .
// You would want to draw something here.
// The result will be accumulated in `layerAccumulate` and will be presented using `layerPresent`.

// == template codes ===============================================================================

precision highp float;

uniform int frame;
uniform vec2 resolution;

out vec4 fragColor;

#define iFrame frame
#define iResolution vec4(resolution,resolution/resolution.yx)
#define gl_FragColor fragColor

// == your code goes below =========================================================================

#define fs(i) (fract(sin((i)*114.514)*1919.810))

const float PI = acos( -1. );
const float EPSILON = 1E-2;

float seed;

float hash() {
  seed = fs( seed );
  return seed;
}

vec2 hash2() {
  return vec2( hash(), hash() );
}

mat2 rot2d( float t ) {
  float c = cos( t );
  float s = sin( t );
  return mat2( c, -s, s, c );
}

vec4 map( vec3 p ) {
  p = mod( p, 1.0 ) - 0.5;
  float d = length( p ) - 0.1;
  return vec4( d, 0, 0, 0 );
}

void main() {
  seed = fs( gl_FragCoord.x + fs( gl_FragCoord.y + fs( float( iFrame ) ) ) );

  vec2 p = ( gl_FragCoord.xy + hash2() - 0.5 ) / iResolution.xy - 0.5;
  p.x *= iResolution.z;

  vec3 ro = vec3( 0, 0, 5 );
  vec3 rd = normalize( vec3( p, -1 ) );

  vec2 bokehOffset = ( hash2() - 0.5 ) * rot2d( PI * 0.25 );
  const float dofScale = 0.5;
  const float focusDistance = 5.0;
  ro.xy += bokehOffset * dofScale;
  rd.xy -= bokehOffset * dofScale / focusDistance;

  vec3 col = vec3( 0 );

  float rl = 0.0;
  vec3 rp = ro;
  vec4 isect = vec4( 0 );
  for( int i = 0; i < 200; i ++ ) {
    isect = map( rp );
    rl += 0.7 * isect.x;
    rp = ro + rd * rl;
    if( abs( isect.x ) < EPSILON ) break;
  }

  if ( abs( isect.x ) < EPSILON ) {
    vec2 d = vec2( 0, EPSILON );
    vec3 n = normalize( vec3(
      map( rp + d.yxx ).x - map( rp - d.yxx ).x,
      map( rp + d.xyx ).x - map( rp - d.xyx ).x,
      map( rp + d.xxy ).x - map( rp - d.xxy ).x
    ) );

    col = ( 0.5 + 0.5 * sin( rp.z + vec3( 0, 1, 2 ) ) )
      * ( dot( n, normalize( vec3( 1, 2, 3 ) ) ) * 0.35 + 0.65 )
      * exp( -0.1 * rl );
  }

  fragColor = vec4( col, 1 );
}
