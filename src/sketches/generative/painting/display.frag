#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_paint;
uniform sampler2D u_stroke;
uniform sampler2D u_image;
uniform sampler2D u_flow;
uniform float u_progress;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  vec4 color = texture2D(u_paint, vec2(st.x, 1.0 -st.y));


  // debug flow field
  vec4 flowData = texture2D(u_flow, vec2(st.x, 1.0 -st.y));
  // look at flow
  gl_FragColor = vec4(flowData.rgb, 1.0);

  // real one 
  gl_FragColor = vec4(color.rgb, 1.0);
}
