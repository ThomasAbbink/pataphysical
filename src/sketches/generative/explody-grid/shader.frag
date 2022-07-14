precision highp float;

uniform vec2 resolution;
uniform vec3 points[50];
uniform  float size;
uniform vec3 color;

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

  vec4 background_color = vec4(0.05, 0.07, 0.1, 1.0);


  float v = smoothstep(size, 0.0, dist_to_closest_point);
  float r = clamp(0.0, color.r, v);
  float g = clamp(0.0, color.g, v);
  float b = clamp(0.0, color.b, v);



  gl_FragColor = background_color +  vec4(r, g, b, v) - vec4(smoothstep(size / 8.0, 0.0, dist_to_closest_point)) ;
}