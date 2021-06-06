#version 300 es

precision highp float;

uniform int frame;
uniform vec2 resolution;
uniform sampler2D samplerRandom;

out vec4 fragColor;

const float PI = acos( -1. );
const float TAU = PI * 2.0;
const float EPSILON = 1E-4;
const float FAR = 1E3;

vec4 seed;

// Ref: https://cs.uwaterloo.ca/~thachisu/tdf2015.pdf
float random() {
  const vec4 q = vec4( 1225, 1585, 2457, 2098 );
  const vec4 r = vec4( 1112, 367, 92, 265 );
  const vec4 a = vec4( 3423, 2646, 1707, 1999 );
  const vec4 m = vec4( 4194287, 4194277, 4194191, 4194167 );
    vec4 beta = floor( seed / q );
    vec4 p = a * ( seed - beta * q ) - beta * r;
    beta = ( sign( -p ) + vec4( 1 ) ) * vec4( 0.5 ) * m;
    seed = ( p + beta );
    return fract( dot( seed / m, vec4( 1, -1, 1, -1 ) ) );
}

vec2 random2() {
  return vec2( random(), random() );
}

vec3 randomSphere() {
  float phi = TAU * random();
  float theta = acos( 1.0 - 2.0 * random() );
  return vec3(
    cos( phi ) * sin( theta ),
    sin( phi ) * sin( theta ),
    cos( theta )
  );
}

vec3 randomHemisphere( vec3 N ) {
  vec3 d = randomSphere();
  return dot( N, d ) < 0.0 ? -d : d;
}

mat3 orthBas( vec3 d ) {
  vec3 z = normalize( d );
  vec3 x = normalize( cross(
    abs( z.y ) < 0.999 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ),
    z
  ) );
  return mat3( x, cross( z, x ), z );
}

vec3 F_Schlick( vec3 f0, float VdotH ) {
  float v = 1.0 - VdotH;
  return mix( f0, vec3( 1.0 ), ( v * v ) * ( v * v ) * v );
}

float G_Smith( float roughness, float NdotV, float NdotL ) {
  float k = roughness;
  k = k * k;
  k /= 2.0;

  float G1V = NdotV / ( NdotV * ( 1.0 - k ) + k );
  float G1L = NdotL / ( NdotL * ( 1.0 - k ) + k );

  return G1V * G1L;
}

vec3 importanceSampleLambert( vec3 N ) {
  float phi = TAU * random();
  float cosTheta = random();
  cosTheta = cos( asin( sqrt( cosTheta ) ) );
  float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );

  return orthBas( N ) * vec3(
    cos( phi ) * sinTheta,
    sin( phi ) * sinTheta,
    cosTheta
  );
}

vec3 importanceSampleGGX( float roughness, vec3 N ) {
  float phi = TAU * random();
  float cosTheta = random();
  cosTheta = sqrt( ( 1.0 - cosTheta ) / ( 1.0 + ( pow( roughness, 4.0 ) - 1.0 ) * cosTheta ) );
  float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );

  return orthBas( N ) * vec3(
    cos( phi ) * sinTheta,
    sin( phi ) * sinTheta,
    cosTheta
  );
}

struct Material {
  vec3 albedo;
  float roughness;
  float metallic;
  vec3 emissive;
};

struct Isect {
  float l;
  vec3 N;
  Material mtl;
};

Isect isectMiss() {
  Isect isect;
  isect.l = FAR;
  return isect;
}

Isect isectMin( Isect a, Isect b ) {
  if ( a.l < b.l ) {
    return a;
  } else {
    return b;
  }
}

Isect isectSphere( vec3 ro, vec3 rd, float r, Material mtl ) {
  float b = dot( rd, ro );
  float c = dot( ro, ro ) - r * r;

  float d = b * b - c;

  if ( d >= 0.0 ) {
    float s = sqrt( d );
    float t = -b - s;

    if ( t <= 0.0 ) {
      t = -b + s;
    }

    if ( t > 0.0 ) {
      return Isect( t, normalize( ro + rd * t ), mtl );
    }
  }

  return isectMiss();
}

Isect isectPlane( vec3 ro, vec3 rd, vec3 n, Material mtl ) {
  float v = dot( rd, n );
  float t = -( dot( ro, n ) ) / v;

  if ( t > 0.0 ) {
    return Isect( t, n, mtl );
  }

  return isectMiss();
}

Isect map( vec3 ro, vec3 rd ) {
  Material mtl;
  mtl = Material( vec3( 0.8, 0.2, 0.1 ), 0.1, 0.0, vec3( 0.0 ) );
  Isect isect = isectSphere( ro - vec3( -2.5, 0.0, 0.0 ), rd, 1.0, mtl );

  mtl = Material( vec3( 0.8, 0.2, 0.1 ), 0.5, 0.0, vec3( 0.0 ) );
  isect = isectMin( isect, isectSphere( ro, rd, 1.0, mtl ) );

  mtl = Material( vec3( 0.8, 0.2, 0.1 ), 0.9, 0.0, vec3( 0.0 ) );
  isect = isectMin( isect, isectSphere( ro - vec3( 2.5, 0.0, 0.0 ), rd, 1.0, mtl ) );

  mtl = Material( vec3( 0.8 ), 0.1, 0.0, vec3( 0.0 ) );
  isect = isectMin( isect, isectPlane( ro + vec3( 0.0, 1.0, 0.0 ), rd, vec3( 0.0, 1.0, 0.0 ), mtl ) );

  mtl = Material( vec3( 0.0 ), 0.0, 0.0, vec3( 10.0, 20.0, 30.0 ) );
  isect = isectMin( isect, isectSphere( ro - vec3( 10.0, 10.0, 10.0 ), rd, 5.0, mtl ) );

  return isect;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  seed = texture( samplerRandom, uv );
  seed += float( frame );
  random();

  vec2 p = ( gl_FragCoord.xy + random2() - 0.5 ) / resolution.xy - 0.5;
  p.x *= resolution.x / resolution.y;

  vec3 ro = vec3( 0, 0, 5 );
  vec3 rd = normalize( vec3( p, -1 ) );

  vec3 col = vec3( 0 );
  vec3 colRem = vec3( 1 );

  for ( int iRef = 0; iRef < 6; iRef ++ ) {
    Isect isect = map( ro, rd );

    if ( isect.l >= FAR ) {
      // col += 0.5 * colRem;
      break;
    }
    col += isect.mtl.emissive * colRem;

    ro += rd * isect.l + isect.N * EPSILON;

    vec3 albedo = mix( 0.96 * isect.mtl.albedo, vec3( 0.0 ), isect.mtl.metallic );
    vec3 f0 = mix( vec3( 0.04 ), isect.mtl.albedo, isect.mtl.metallic );

    if ( random() < 0.5 ) {
      // specular
      // Ref: http://gregory-igehy.hatenadiary.com/entry/2015/02/26/154142
      vec3 H = importanceSampleGGX( isect.mtl.roughness, isect.N );
      vec3 wo = reflect( rd, H );
      if ( dot( wo, isect.N ) < 0.0 ) { break; }

      float VdotH = dot( -rd, H );
      float NdotL = dot( isect.N, wo );
      float NdotH = dot( isect.N, H );
      float NdotV = dot( isect.N, -rd );
      vec3 F = F_Schlick( f0, VdotH );
      float G = G_Smith( isect.mtl.roughness, NdotV, NdotL );

      colRem *= F * G * VdotH / ( NdotH * NdotV );
      rd = wo;
    } else {
      // diffuse
      vec3 wo = importanceSampleLambert( isect.N );
      vec3 H = normalize( -rd + wo );

      float VdotH = dot( -rd, H );
      vec3 F = F_Schlick( f0, VdotH );

      colRem *= ( 1.0 - F ) * albedo;
      rd = wo;
    }

    colRem *= 2.0;

    if ( dot( colRem, colRem ) < EPSILON ) {
      break;
    }
  }

  fragColor += vec4( col, 1.0 );
}
