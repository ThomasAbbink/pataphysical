#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D tex;
#include "/node_modules/lygia/generative/fbm.glsl"


void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 uv = st * 200.0;
    float x = floor(uv.x);
    float y = floor(uv.y);

    float xx = fract(uv.x);
    float yy = fract(uv.y);

    vec4 data = texture2D(tex, st);
    float d = distance(data.rg, st.xy) *50.;
    float dc = distance(vec2(xx, yy), vec2(0.5));

    float direction = clamp(data.r - data.g, 0., 1.);

    // float r = smoothstep(d* dc, 0., 1.0);
    // float r = 0.0;

    vec3 red = vec3(0.78, 0.03, 0.005);
    vec3 green = vec3(0.03, 0.93, 0.03);
    vec3 blue = vec3(0.02, 0.1, 0.88);

    float r = smoothstep(fbm(vec2(data.r, data.g) + vec2(sin(st.x *sin(u_time * 0.001)), cos(st.y) * cos(u_time * 0.001))),1.0 , 0.5  + (sin(u_time *0.001) * 0.1));
    float g = smoothstep(fbm(vec2(data.r, data.g) + vec2(sin(st.x *sin(u_time * 0.001)), cos(st.y) * cos(u_time * 0.001))),1.0 , 0.1+ (cos(u_time *0.1) * 0.01));
    float b = smoothstep(fbm(vec2(data.r, data.g) + vec2(sin(st.x *sin(u_time * 0.001)), cos(st.y) * cos(u_time * 0.001))),1.0 ,0.01);


    vec3 colors = (red * r) + (green  * g) + (blue * b);
    gl_FragColor = vec4(colors,1.0);
}