#define MARCH_ITER 128
#define MARCH_EPSILON 1E-2
#define MARCH_NEAR_ENOUGH 1E-2
#define MARCH_WAY_NEAR 1E-3
#define MARCH_FAR 40.0
#define MARCH_MULP 0.6

#define HALF_PI 1.57079632679
#define PI 3.14159265359
#define TAU 6.28318530718
#define saturate(i) clamp(i,0.,1.)
#define linearstep(a,b,t) saturate(((t)-(a))/((b)-(a)))

precision highp float;

// == variables ====================================================================================
varying vec2 vUv;
uniform float time;
uniform vec2 resolution;
uniform sampler2D sampler0;

// == common =======================================================================================
mat2 rotate2D( float t ) {
  return mat2( cos( t ), -sin( t ), sin( t ), cos( t ) );
}

bool isValidUv( vec2 uv ) {
  return 0.0 < uv.x && uv.x < 1.0 && 0.0 < uv.y && uv.y < 1.0;
}

float ditherThreshold( vec2 coord ) {
  vec2 c = floor( mod( coord, 2.0 ) );
  return c.x + 2.0 * mod( c.x + c.y, 2.0 );
}

// == camera =======================================================================================
struct Camera {
  vec3 pos;
  vec3 dir;
  vec3 up;
  float roll;
  float fov;
};

Camera newCamera( vec3 pos, vec3 dir ) {
  Camera camera;
  camera.pos = pos;
  camera.dir = dir;
  camera.up = vec3( 0.0, 1.0, 0.0 );
  camera.roll = 0.0;
  camera.fov = 0.5;
  return camera;
}

// == ray ==========================================================================================
struct Ray {
  vec3 orig;
  vec3 dir;
};

Ray newRay( vec3 ori, vec3 dir ) {
  Ray ray;
  ray.orig = ori;
  ray.dir = dir;
  return ray;
}

Ray rayFromCamera( Camera camera, vec2 p ) {
  vec3 dirX = normalize( cross( camera.dir, camera.up ) );
  vec3 dirY = cross( dirX, camera.dir );
  vec2 pt = rotate2D( camera.roll ) * p;
  return newRay(
    camera.pos,
    normalize( pt.x * dirX + pt.y * dirY + camera.dir / tan( camera.fov ) )
  );
}

vec3 getRayPosition( Ray ray, float len ) {
  return ray.orig + ray.dir * len;
}

// == isect ========================================================================================
struct Intersection {
  Ray ray;
  float len;
  vec3 pos;
};

Intersection newIntersection( Ray ray, float len ) {
  Intersection isect;
  isect.ray = ray;
  isect.len = len;
  isect.pos = getRayPosition( ray, len );
  return isect;
}

// == march result =================================================================================
struct MarchResult {
  float dist;
  vec2 uv;
  float charDist;
  float glow;
};

// == distFuncs ====================================================================================
MarchResult distFunc( vec3 p ) {
  MarchResult result;

  vec3 pt = p;
  pt.zx = rotate2D( PI * time * 2.0 ) * pt.zx;
  pt.yz = rotate2D( -0.5 ) * pt.yz;

  vec2 uv = saturate( 0.5 * pt.xy + 0.5 );
  float tex = texture2D( sampler0, uv ).x;
  result.charDist = ( 0.5 - tex );

  result.uv = uv;
  result.dist = length( p ) - 8.8;
  result.dist = max(
    result.dist,
    result.charDist - 0.02 + 0.5 * clamp( abs( pt.z ), 0.0, 0.04 )
  );
  result.dist = max(
    result.dist,
    abs( pt.z ) - 0.04 + 0.4 * result.charDist
  );

  result.glow = abs( result.dist ) * exp( -25.0 * abs( result.dist ) );

  return result;
}

vec3 normalFunc( vec3 p, float dd ) {
  vec2 d = vec2( 0.0, dd );
  return normalize( vec3(
    distFunc( p + d.yxx ).dist - distFunc( p - d.yxx ).dist,
    distFunc( p + d.xyx ).dist - distFunc( p - d.xyx ).dist,
    distFunc( p + d.xxy ).dist - distFunc( p - d.xxy ).dist
  ) );
}

vec3 normalFunc( vec3 p ) {
  return normalFunc( p, MARCH_EPSILON );
}

// == main procedure ===============================================================================
void main() {
  vec2 p = ( vUv * resolution * 2.0 - resolution ) / resolution.x;
  Camera camera = newCamera(
    vec3( 0.0, 0.0, 1.0 ),
    vec3( 0.0, 0.0, -1.0 )
  );
  camera.fov = 1.0;
  Ray ray = rayFromCamera( camera, p );

  Intersection isect;
  float rayLen = MARCH_NEAR_ENOUGH;
  vec3 rayPos = getRayPosition( ray, rayLen );
  MarchResult result;
  float glow = 0.0;

  for ( int i = 0; i < MARCH_ITER; i ++ ) {
    result = distFunc( rayPos );
    glow += result.glow;
    if ( abs( result.dist ) < MARCH_WAY_NEAR ) { break; }
    rayLen += result.dist * MARCH_MULP;
    if ( MARCH_FAR < rayLen ) { break; }
    rayPos = getRayPosition( ray, rayLen );
  }

  vec3 color = vec3( 0.0 );

  vec3 baseColor = vec3( 100.0, 80.0 + 40.0 * cos( time * PI * 20.0 ), 5.0 );

  if ( abs( result.dist ) < MARCH_NEAR_ENOUGH ) {
    vec3 normal = normalFunc( rayPos );

    vec2 uv = result.uv;
    float phase = 20.0 * ( uv.y - 0.51 );
    vec3 gold = phase < 0.0
      ? baseColor * exp( -6.0 * ( phase + 1.0 ) )
      : baseColor * exp( -6.0 * phase );
    vec3 dif = vec3( 0.2 + 0.8 * saturate( normal.z ) );
    dif *= mix(
      vec3( 0.1, 0.1, 0.1 ),
      gold,
      linearstep( 0.0, -0.001, result.charDist )
    );
    float spe = pow( saturate( normal.z ), 50.0 );

    gl_FragColor = vec4( dif + spe, 1.0 );
  } else {
    float g = glow * 0.1;
    vec3 color = max( g, 0.01 ) * 1.0 * baseColor;
    float a = pow( min( g, 0.01 ) * 100.0, 1.0 );
    a += 0.25 * ditherThreshold( gl_FragCoord.xy );
    a += 0.0625 * ditherThreshold( gl_FragCoord.xy * 0.5 );

    if ( 1.0 <= a ) {
      gl_FragColor = vec4( color, 1.0 );
    } else {
      gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.0 );
    }
  }
}
