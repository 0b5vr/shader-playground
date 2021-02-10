precision highp float;

varying vec2 vUv;
uniform float time;
uniform sampler2D sampler0;

#define ZOOM_ITER 40
#define ZOOM_CENTER vec2(0.5,0.5)
#define ZOOM_AMP 0.05
#define ZOOM_OUTSIDE_AMP 0.4
#define ZOOM_OUTSIDE_OFFSET 0.5
#define CHROMA_MIX 0.5

#define HUGE 9E16
#define PI 3.14159265
#define saturate(i) clamp(i,0.,1.)

float gray( vec3 rgb ) {
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
}

void main() {
  float len = length( vUv - ZOOM_CENTER );

  vec4 tex = vec4( 0.0 );

  for ( int i = 0; i < ZOOM_ITER; i ++ ) {
    float fi = ( float( i ) + 0.5 ) / float( ZOOM_ITER );
    vec3 blurA = vec3(
      1.0 - 2.0 * abs( 1.0 / 2.0 - fi )
    ) * 2.0;
    vec3 blurB = saturate( vec3(
      1.0 - 4.0 * abs( 1.0 / 4.0 - fi ),
      1.0 - 4.0 * abs( 2.0 / 4.0 - fi ),
      1.0 - 4.0 * abs( 3.0 / 4.0 - fi )
    ) ) * 4.0;
    vec3 blur = vec3(
      mix( blurA, blurB, CHROMA_MIX ) / float( ZOOM_ITER )
    );
    float scaleAmp = ( ZOOM_OUTSIDE_AMP * len + ZOOM_AMP ) * fi + ZOOM_OUTSIDE_OFFSET * len;
    vec2 uvt = ( 1.0 - scaleAmp ) * ( vUv - ZOOM_CENTER ) + ZOOM_CENTER;
    tex += vec4( blur, gray( blur ) ) * texture2D( sampler0, uvt );
  }

  gl_FragColor = tex;
}
