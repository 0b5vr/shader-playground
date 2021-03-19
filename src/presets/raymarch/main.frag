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
};

// == distFuncs ====================================================================================
MarchResult distFunc( vec3 p ) {
  MarchResult result;

  result.dist = length( p ) - 1.0;
  result.uv = vec2(
    0.5 + 0.5 * atan( p.z, p.x ) / PI,
    0.5 + atan( p.y, length( p.zx ) ) / PI
  );

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
    vec3( 0.0, 0.0, 5.0 ),
    vec3( 0.0, 0.0, -1.0 )
  );
  camera.fov = 0.25 * PI;
  Ray ray = rayFromCamera( camera, p );

  Intersection isect = newIntersection( ray, MARCH_NEAR_ENOUGH );
  MarchResult result;

  for ( int i = 0; i < MARCH_ITER; i ++ ) {
    result = distFunc( isect.pos );
    if ( abs( result.dist ) < MARCH_WAY_NEAR ) { break; }
    isect.len += result.dist * MARCH_MULP;
    if ( MARCH_FAR < isect.len ) { break; }
    isect.pos = getRayPosition( ray, isect.len );
  }

  vec3 color = vec3( 0.0 );

  if ( abs( result.dist ) < MARCH_NEAR_ENOUGH ) {
    vec3 normal = normalFunc( isect.pos );
    vec2 uv = result.uv;

    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0 );
  } else {
    gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.0 );
  }
}
