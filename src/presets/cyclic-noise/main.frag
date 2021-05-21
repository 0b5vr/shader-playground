precision highp float;

varying vec2 vUv;
uniform float time;

mat3 orthBasis( vec3 z ) {
  z = normalize( z );
  vec3 x = normalize( cross(
    abs( z.y ) > 0.999 ? vec3( 0, 0, 1 ) : vec3( 0, 1, 0 ),
    z
  ) );
  return mat3( x, cross( z, x ), z );
}

vec3 cyclicNoise( vec3 p, vec3 v, float pump ) {
  mat3 b = orthBasis( v );
  vec4 sum = vec4( 0.0 );
  float warp = 1.1;

  for ( int i = 0; i < 5; i ++ ) {
    p *= b * 2.0;
    p += sin( p.zxy ) * warp;
    sum = sum * pump + vec4( cross( cos( p ), sin( p.yzx ) ), 1.0 );
    warp *= 1.3;
  }

  return sum.xyz / sum.w;
}

void main() {
  vec3 noise = cyclicNoise(
    vec3( vUv, time ),
    vec3( 1 ),
    2.0
  );

  vec3 col = 0.5 + 0.5 * noise;

  gl_FragColor = vec4( col, 1.0 );
}
