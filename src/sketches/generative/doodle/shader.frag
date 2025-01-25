#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;



void main() {
    float zoom = 1.;
    vec2 resolution = u_resolution.xy;
    vec2 coordinate = zoom*(2.*gl_FragCoord.xy-resolution)/vec2(resolution.y, resolution.y);
    vec3 color = vec3(0.52, 0.807, 0.92);
    vec2 location = vec2(-.3, 0.6);
    float d = distance(coordinate, location);
    vec3 yellow = vec3(1., 0.87, 0.75);
    color +=  (yellow * smoothstep(0.2, 0.1, d));
    color += smoothstep(0.3, 0.0, d);
    
    gl_FragColor = vec4(color, 1.);
}