precision highp float;

uniform vec2 resolution;
uniform float factor;
uniform vec2 balls[4];
uniform float ball_size;
uniform float flurb_size;
uniform float r;
uniform float g;
uniform float b;

float plot(vec2 st){
  return smoothstep(0.02, 0.0, abs(st.y - st.x));
}


float circle(in vec2 st, in float radius){
  vec2 center = st-vec2(0.5);
  float d  = dot(center, center) * 4.0;
  return 1.0 - smoothstep(radius - (radius * 0.5), radius + (radius * 0.3), d);
}

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec3 color = vec3(0.0);
  float ball_dist = 0.8;
  // float ball_dist = distance(st, ball);
  for (int i = 0; i < 4; i++) {
    float dist = distance(st, balls[i]);
    if(dist < ball_dist){
      ball_dist = dist;
    }
  }

  vec2 st_mult = st * factor * ball_dist ;
  vec2 st_fract = fract(st_mult);
  color = vec3(clamp( st_fract.y, 0.1, r), clamp( st_fract.y, 0.1, g), clamp( st_fract.y, 0.1, b));
  color = color + vec3(circle(st_fract, flurb_size) * 0.9);
  color =  color * smoothstep(0.3, 0.0, ball_dist);
  color =  color * smoothstep(0.0, 0.05, ball_dist);
  gl_FragColor = vec4(color, 1.0) ;
}