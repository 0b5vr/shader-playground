precision highp float;

const vec4 LIFT = vec4( 0.02, -0.01, 0.09, 0.0 );
const vec4 GAMMA = vec4( -0.05, 0.02, -0.08, 0.0 );
const vec4 GAIN = vec4( 1.06, 0.96, 1.10, 1.0 );

const vec3 LUMA = vec3( 0.2126, 0.7152, 0.0722 );

varying vec2 vUv;
uniform sampler2D sampler0;

vec3 liftGammaGain( vec3 rgb, vec4 lift, vec4 gamma, vec4 gain ) {
  vec4 liftt = 1.0 - pow( 1.0 - lift, log2( gain + 1.0 ) );

  vec4 gammat = gamma.rgba - vec4( 0.0, 0.0, 0.0, dot( LUMA, gamma.rgb ) );
  vec4 gammatTemp = 1.0 + 4.0 * abs( gammat );
  gammat = mix( gammatTemp, 1.0 / gammatTemp, step( 0.0, gammat ) );

  vec3 col = rgb;
  float luma = dot( LUMA, col );

  col = pow( col, gammat.rgb );
  col *= pow( gain.rgb, gammat.rgb );
  col = max( mix( 2.0 * liftt.rgb, vec3( 1.0 ), col ), 0.0 );

  luma = pow( luma, gammat.a );
  luma *= pow( gain.a, gammat.a );
  luma = max( mix( 2.0 * liftt.a, 1.0, luma ), 0.0 );

  col += luma - dot( LUMA, col );

  return col;
}

void main() {
  vec2 uv = vUv;
  vec4 tex = texture2D( sampler0, uv );

  vec3 col = liftGammaGain( tex.rgb, LIFT, GAMMA, GAIN );
  gl_FragColor = vec4( col, 1.0 );
}
