#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "lygia/generative/fbm.glsl"
#include "lygia/color/palette.glsl"

void main() {
    vec3 color = vec3(.1);
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float speed = 0.01;

    float move = fbm(vec2(u_time / 10. * speed, u_time / 2. * speed));
    vec2 q = vec2(
        fbm(st + vec2(.0)),
        fbm(st + vec2(5.3, 1.3))
        );
    q = vec2(q.x +move ,q.y +move);
 
    vec2 r  = vec2(
        fbm(2.0 * q + vec2(1.7, 3.2) + u_time /10.), 
        fbm(2.0 * q + vec2(8.3, 2.8) + u_time / 10.)
    );
    r = vec2(r.x +move ,r.y +move);



    color += fbm(st * 2.0 *r);
    vec3 startColor = vec3(.88, .99,.77);
    vec3 endColor  = vec3(.88, .55,.25);

    color = mix(color, startColor, sin(st.x + u_time) -  dot(q,q));
    color = mix(color, endColor,sin(st.x + u_time) +  dot(r,r));
    // color = mix( color, endColor, vec3(1 - pow(st.y, 10.)));

    // color  += mix(startColor, endColor, st.x);
    // color += step(0.9, r.y);
    
    
    gl_FragColor = vec4(color,1.0);

}