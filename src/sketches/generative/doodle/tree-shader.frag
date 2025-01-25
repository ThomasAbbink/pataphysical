#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;



void main() {
    float zoom = 1.;
    vec2 resolution = u_resolution.xy;
    vec2 coordinate = zoom*(2.*gl_FragCoord.xy-resolution)/vec2(resolution.y, resolution.y);
    vec3 color = vec3(1., coordinate.x, 0.);

    color += smoothstep(0., 0.5, abs(coordinate.x));
    
    gl_FragColor = vec4(color, 1.);
}