#version 300 es

precision highp float;

in vec2 vUv;
out vec4 fragColor;
uniform sampler2D sampler0;

void main() {
  vec2 uv = vUv;
  vec4 tex = texture(sampler0, uv);
  fragColor = tex;
}
