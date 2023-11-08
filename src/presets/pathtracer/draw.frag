#version 300 es

precision highp float;

uniform int frame;
uniform vec2 resolution;
uniform sampler2D samplerRandom;

out vec4 fragColor;

const int SAMPLES_PER_FRAME = 8;
const int REFLECTIONS_PER_SAMPLE = 4;

const float PI = acos( -1. );
const float TAU = PI * 2.0;
const float EPSILON = 1E-4;
const float FAR = 1E3;

float safeDot( vec3 a, vec3 b ) {
  return max( dot( a, b ), 1E-6 );
}

// http://www.jcgt.org/published/0009/03/02/
uvec3 hash3u( uvec3 v ) {
  v = v * 1664525u + 1013904223u;

  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;

  v ^= v >> 16u;

  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;

  return v;
}

vec3 hash3f( vec3 v ) {
  uvec3 r = hash3u( floatBitsToUint( v ) );
  return vec3( r ) / float( -1u );
}

uvec3 seed;
uvec3 random3u() {
  seed = hash3u( seed );
  return seed;
}

vec3 random3f() {
  uvec3 r = random3u();
  return vec3( r ) / float( -1u );
}

vec3 randomSphere() {
  vec3 xi = random3f();
  float phi = TAU * xi.x;
  float theta = acos( 1.0 - 2.0 * xi.y );
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

float F_Schlick( float f0, float VdotH ) {
  float v = 1.0 - VdotH;
  return mix( f0, 1.0, ( v * v ) * ( v * v ) * v );
}

float G_Smith( float roughness, float NdotV, float NdotL ) {
  float a = roughness * roughness;
  float a2 = a * a;
  float k = a2 / 2.0;

  float G1V = NdotV / ( NdotV * ( 1.0 - k ) + k );
  float G1L = NdotL / ( NdotL * ( 1.0 - k ) + k );

  return G1V * G1L;
}

vec3 importanceSampleLambert( vec3 N ) {
  vec3 xi = random3f();
  float phi = TAU * xi.x;
  float cosTheta = xi.y;
  cosTheta = cos( asin( sqrt( cosTheta ) ) );
  float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );

  return orthBas( N ) * vec3(
    cos( phi ) * sinTheta,
    sin( phi ) * sinTheta,
    cosTheta
  );
}

vec3 importanceSampleGGX( float roughness, vec3 N ) {
  float a = roughness * roughness;
  float a2 = a * a;

  vec3 xi = random3f();
  float phi = TAU * xi.x;
  float cosTheta = xi.y;
  cosTheta = sqrt( ( 1.0 - cosTheta ) / ( 1.0 + ( a2 - 1.0 ) * cosTheta ) );
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

  mtl = Material( vec3( 0.0 ), 0.5, 0.0, vec3( 0.0 ) );
  isect = isectMin( isect, isectSphere( ro, rd, 1.0, mtl ) );

  mtl = Material( vec3( 0.3, 0.4, 0.5 ), 0.9, 0.0, vec3( 0.0 ) );
  isect = isectMin( isect, isectSphere( ro - vec3( 2.5, 0.0, 0.0 ), rd, 1.0, mtl ) );

  mtl = Material( vec3( 0.8 ), 0.1, 0.0, vec3( 0.0 ) );
  isect = isectMin( isect, isectPlane( ro + vec3( 0.0, 1.0, 0.0 ), rd, vec3( 0.0, 1.0, 0.0 ), mtl ) );

  mtl = Material( vec3( 0.0 ), 0.0, 0.0, vec3( 50.0 / PI ) );
  isect = isectMin( isect, isectSphere( ro - vec3( 0.0, 20.0, 0.0 ), rd, 5.0, mtl ) );

  return isect;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  seed = uvec3( gl_FragCoord.xy, frame );

  for ( int iSample = 0; iSample < SAMPLES_PER_FRAME; iSample ++ ) {
    vec2 p = ( gl_FragCoord.xy + random3f().xy - 0.5 ) / resolution.xy - 0.5;
    p.x *= resolution.x / resolution.y;

    vec3 ro = vec3( 0, 0, 5 );
    vec3 rd = normalize( vec3( p, -1 ) );

    vec3 col = vec3( 0 );
    vec3 colRem = vec3( 1 );

    for ( int iRef = 0; iRef < REFLECTIONS_PER_SAMPLE; iRef ++ ) {
      Isect isect = map( ro, rd );

      if ( isect.l >= FAR ) {
        // col += 0.5 * colRem;
        break;
      }
      col += isect.mtl.emissive * colRem;

      ro += rd * isect.l + isect.N * EPSILON;

      vec3 albedo = mix( 0.96 * isect.mtl.albedo, vec3( 0.0 ), isect.mtl.metallic );
      vec3 f0 = mix( vec3( 0.04 ), isect.mtl.albedo, isect.mtl.metallic );

      float NdotV = safeDot( isect.N, -rd );
      float Fn = mix(
        F_Schlick( 0.04, NdotV ),
        1.0,
        isect.mtl.metallic
      );

      if ( random3f().x < Fn ) {
        // specular
        // Ref: http://gregory-igehy.hatenadiary.com/entry/2015/02/26/154142
        vec3 H = importanceSampleGGX( isect.mtl.roughness, isect.N );
        vec3 wo = reflect( rd, H );
        if ( dot( wo, isect.N ) < 0.0 ) { break; }

        float VdotH = safeDot( -rd, H );
        float NdotL = safeDot( isect.N, wo );
        float NdotH = safeDot( isect.N, H );
        vec3 F = F_Schlick( f0, VdotH );
        float G = G_Smith( isect.mtl.roughness, NdotV, NdotL );

        colRem *= F * G * VdotH / ( NdotH * NdotV ) / Fn;
        rd = wo;
      } else {
        // diffuse
        vec3 wo = importanceSampleLambert( isect.N );
        vec3 H = normalize( -rd + wo );

        float VdotH = dot( -rd, H );
        vec3 F = F_Schlick( f0, VdotH );

        colRem *= ( 1.0 - F ) * albedo / ( 1.0 - Fn );
        rd = wo;
      }

      if ( dot( colRem, colRem ) < EPSILON ) {
        break;
      }
    }

    fragColor += vec4( col, 1.0 );
  }
}
