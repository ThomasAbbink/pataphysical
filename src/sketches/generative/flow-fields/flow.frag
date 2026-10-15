#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;


#include "/node_modules/lygia/generative/fbm.glsl"


void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float x = fbm(st );
    float y = fbm(vec2(x) - st);
    float z = fbm(vec2(y));

    vec4 color = vec4(x, y, z, 1.0);
    gl_FragColor = color;
}