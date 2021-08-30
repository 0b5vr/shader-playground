precision highp float;

varying vec2 vUv;
uniform sampler2D sampler0;

void main() {
  vec2 uv = vUv;
  vec4 tex = texture2D( sampler0, uv );
  gl_FragColor = tex;
}
