#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D tex;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec4 data = texture2D(tex, st);
    float d =  distance(data.rg, st.xy);
    gl_FragColor = vec4(vec3(d),1.0);
}