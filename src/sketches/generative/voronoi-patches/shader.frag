precision highp float;

uniform vec2 resolution;
uniform vec3 points[50];
uniform  float shine_size;
uniform  float inner_eye_size;
uniform vec3 color;
uniform vec4 background_color;
uniform float time;

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
 
  // float distance_to_closest_point = 1.0;
  vec3 closest_point = vec3(2.0, 2.0, 0.0);

  for (int i = 0; i < 50; i++) {
    vec3 point = points[i];
    float dist_to_point = distance(st, point.xy);
    float dist_to_closest_point = distance(st, closest_point.xy);
    if (dist_to_point < dist_to_closest_point) {
        closest_point = point;
    }
  }


  float dist_to_closest_point = distance(st, closest_point.xy);


  float v = smoothstep(shine_size, 0.0, dist_to_closest_point);
  float r = clamp(0.0, color.r, v);
  float g = clamp(0.0, color.g, v);
  float b = clamp(0.0, color.b, v);



  gl_FragColor = background_color +  vec4(r, g, b, v) - vec4(smoothstep(inner_eye_size, 0.0, dist_to_closest_point)) ;
}