#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D tex;



void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec4 data = texture2D(tex, st);
    vec3 colors = data.rgb;

   vec3 colA = vec3(0.1294, 0.1294, 0.1569);
   vec3 colB = vec3(0.72, 0.79, 0.97);
   float d = distance(st, vec2(0.5));
   float bcocentration = smoothstep(0., 0.4, data.g) ;

   float c = smoothstep(0.0, 1.,  bcocentration);

   vec3 innerColor = vec3(1., 1., 1.);
   vec3 outerColor = vec3(0.37, 0.83, 0.95);

   float speed =  u_time * 0.01;
   vec3 m =  vec3(sin(speed), cos(  speed / 3.), sin( speed *2.)) * 0.5;

   outerColor = mix(outerColor, m, 3.14159 * (sin(speed) - cos(speed)));


   colB *= mix(innerColor, outerColor, d * 1.5);

   vec3 color = mix(colA, colB, clamp(0., 1., c));
   gl_FragColor = vec4(color, 1.0);
    
}