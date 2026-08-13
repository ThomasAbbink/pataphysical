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
    float ux = floor(data.b) / 1000.0;
    float uy = fract(data.b);

   float distance_to_blob = distance(st, vec2(ux, uy));
   float distance_to_center = distance(st, vec2(0.5));
   float bcocentration = smoothstep(0., 0.2, data.g);

   // float c = smoothstep(0.0, 1.,  bcocentration);

   vec3 innerColor = vec3(.98, .91, .93);
   vec3 outerColor = vec3(0.87, 0.22, 0.25);

   float m = smoothstep(0.0, 1.0, distance_to_blob);
   
   colB = mix(innerColor, outerColor, m);


   // colB *= mix(innerColor, outerColor, 1. +  sin(u_time * 0.001));
   vec3 color = mix(colA, colB, clamp(bcocentration, 0., 1. ));

   float alpha = smoothstep(0.1, 0.5, distance_to_center);
   // color += step(d, 0.01); 
   gl_FragColor = vec4(color, 1.0);
    
}