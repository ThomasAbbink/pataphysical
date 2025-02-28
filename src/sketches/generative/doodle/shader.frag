#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;



void main() {
    float zoom = 1.;
    vec2 resolution = u_resolution.xy;
    vec2 coordinate = zoom*(2.*gl_FragCoord.xy-resolution)/vec2(resolution.y, resolution.y);
    vec3 color = vec3(0.063, 0.107, 0.32);
    vec2 location = vec2(0, 0.);
    float d = distance(coordinate, location);
    vec3 yellow = vec3(1., 0.87, 0.75);
    color +=  (yellow * smoothstep(0.95, 0.1, d));
    color += step(0.88, 1. -d);
    
    gl_FragColor = vec4(color, 1.);
}