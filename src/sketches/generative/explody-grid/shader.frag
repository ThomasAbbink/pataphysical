// this is a modification of a shader by adam ferriss
// https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/5_shapes/5-3_polygon

precision mediump float;

// these are known as preprocessor directive
// essentially we are just declaring some variables that wont change
// you can think of them just like const variables

#define PI 3.14159265359
#define TWO_PI 6.28318530718

// we need the sketch resolution to perform some calculations
uniform vec2 resolution;
uniform int point_size;
uniform vec3 points[300];

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
 
  float size = 0.08;
  bool is_close = false;
  float distance_to_closest_point = 1.0;
  float z = 0.0;
  for (int i = 0; i < 300; i++) {
    vec3 point = points[i];
    float dist = distance(st, point.xy);

    if (dist < distance_to_closest_point) {
      distance_to_closest_point = dist;
      z = point.z;
    }
  }


  gl_FragColor = vec4(smoothstep(size, 0.0, distance_to_closest_point) ) - vec4(smoothstep(0.02, 0.0, distance_to_closest_point)) ;
}