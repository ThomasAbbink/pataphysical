#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    float zoom = 1.;
    vec2 resolution = u_resolution.xy;
    vec2 coordinate = zoom*(2.*gl_FragCoord.xy-resolution)/vec2(resolution.y, resolution.y);
    vec3 color = vec3(0.4, .8, 0.4);
    // color += step(0.5, gl_FragCoord.x);
    gl_FragColor = vec4(color, 1.) * step(coordinate.y, 0.5);
}

