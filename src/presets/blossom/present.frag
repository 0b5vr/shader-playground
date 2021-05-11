#version 300 es

// Blossom compatible template
// Blossom is a framework for creating 4k executable graphics, authored by yx
// https://github.com/lunasorcery/Blossom

// This is `present.frag` .
// It's usually just for presenting the accumulated result.
// However you can use this one as an additional pass. Ideal for post processing.
// If you want to draw something, go `layerDraw` instead.

// == template codes ===============================================================================

precision highp float;

uniform vec2 resolution;
uniform sampler2D layerAccumulate;

out vec4 fragColor;

#define iResolution vec4(resolution,resolution/resolution.yx)
#define accumulatorTex layerAccumulate
#define gl_FragColor fragColor

// == your code goes below =========================================================================

void main() {
  // readback the buffer
  vec4 tex = texture( accumulatorTex, gl_FragCoord.xy / iResolution.xy );

  // divide accumulated color by the sample count
  vec3 color = tex.rgb / tex.a;

  /* perform any post-processing you like here */

  // for example, some B&W with an S-curve for harsh contrast
  //color = smoothstep(0.,1.,color.ggg);

  // present for display
  gl_FragColor = vec4( color, 1 );
}
