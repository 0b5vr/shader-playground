// #define PROTANOPIA
// #define DEUTERANOPIA
// #define TRITANOPIA
// #define ACHROMATOPSIA
#define BLEND 1.0

// Ref: https://ixora.io/projects/colorblindness/color-blindness-simulation-research/
// Ref: https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
#define MAT_PROTANOPIA mat3( 0.152286, 0.114503, -0.003882, 1.05258, 0.786281, -0.048116, -0.204868, 0.099216, 1.052 )
#define MAT_DEUTERANOPIA mat3( 0.367322, 0.280085, -0.01182, 0.860646, 0.672501, 0.04294, -0.227968, 0.047413, 0.968881 )
#define MAT_TRITANOPIA mat3( 1.25553,-0.078411,0.004733,-0.076749,0.930809,0.691367,-0.178779,0.147602,0.3039 )
#define VEC_ACHROMATOPSIA vec3( 0.15537, 0.75792, 0.08670 )
precision highp float;

varying vec2 vUv;

uniform sampler2D sampler0;

void main() {
  vec3 tex = texture2D( sampler0, vUv ).rgb;

  vec3 col = pow( tex, vec3( 2.2 ) );

#ifdef PROTANOPIA
  col = mix( col, MAT_PROTANOPIA * col, BLEND );
#endif

#ifdef DEUTERANOPIA
  col = mix( col, MAT_DEUTERANOPIA * col, BLEND );
#endif

#ifdef TRITANOPIA
  col = mix( col, MAT_TRITANOPIA * col, BLEND );
#endif

#ifdef ACHROMATOPSIA
  col = mix( col, vec3( dot( VEC_ACHROMATOPSIA, col ) ), BLEND );
#endif

  gl_FragColor = vec4( pow( col, vec3( 0.4545 ) ), 1.0 );
}
