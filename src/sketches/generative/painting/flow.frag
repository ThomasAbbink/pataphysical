#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_image;
uniform float u_blur;
uniform float u_min_strength;


float lum(vec2 st){
  return dot(texture2D(u_image, st).rgb, vec3(0.299, 0.587, 0.114));
}

vec2 gradient(vec2 st){
  vec2 px = (1.0 / u_resolution) * u_blur;

  float tl = lum(st + vec2(-1.0, 1.0 ) * px);
  float t = lum(st + vec2(0.0, 1.0 ) * px);
  float tr = lum(st + vec2(1.0, 1.0 ) * px);

  float l = lum(st + vec2(-1.0, 0.0) * px);
  float r = lum(st + vec2(1.0, 0.0) * px);

  float bl = lum(st + vec2(-1.0, -1.0) * px);
  float b = lum(st + vec2(0.0, -1.0) * px);
  float br = lum(st + vec2(1.0, -1.0) * px);

  float gx = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
  float gy = (tl + 2.0 * t + tr) - (bl + 2.0 * b + br);
  return vec2(gx, gy) / 8.0;

}

// vec2 coneField(vec2 st) {
//   vec2 d = st - vec2(0.5);
//   vec2 tangent = vec2(-d.y, d.x);
//   return tangent;
// }

vec2 vortex(vec2 st, vec2 center, float weight) {
  vec2 d = st - center;
  float r2 = dot(d, d) + 1e-4;
  return vec2(-d.y, d.x) / r2 * weight; // 1/r², local swirl
}

vec2 coneField(vec2 st) {
  vec2 t = vec2(0.0);
  t += vortex(st, vec2(0.13, 0.1), 0.9);
  t += vortex(st, vec2(0.86, 0.1), 0.9);
  // t += vortex(st, vec2(0.5, 0.8), 0.2);
  // t += vortex(st, vec2(0.5, 0.5), 0.9);
  // t += vortex(st, vec2(0.5, 0.3), 0.8);
  // t += vortex(st, vec2(0.5, 0.1), 0.2);
  t += vortex(st, vec2(0.92, 0.91), 0.9);
  t += vortex(st, vec2(0.05, 0.99), 0.9);
  return t;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec2 texel = 1.0/ u_resolution;
  vec2 g = gradient(st);


  float strength = length(g);
  vec2 acrossEdge = strength > 1e-5 ? g / strength : vec2(1.0, 0.0);
  vec2 alongEdge = vec2(-acrossEdge.y, acrossEdge.x);

  vec2 baseDirection = coneField(st);

  if(dot(alongEdge , baseDirection) < 0.0) {
    alongEdge = -alongEdge;
  }

  float w = smoothstep(u_min_strength, u_min_strength * 3.0, strength);
  vec2 dir = normalize(mix(baseDirection, alongEdge, w));


  //look at sobel
  gl_FragColor = vec4(vec2(length(g) * 3.0), max(strength, 0.2), 1.0);


  // look at base flow
  gl_FragColor = vec4(vec2(normalize(baseDirection) * 0.5 + 0.5), 0.5, 1.0);



  // this is the real one
  gl_FragColor = vec4(dir * 0.5 + 0.5,  max(strength, 0.2), 1.0);
 

}
