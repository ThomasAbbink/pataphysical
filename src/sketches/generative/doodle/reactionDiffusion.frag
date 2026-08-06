#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D tex;
uniform float u_time;
uniform bool u_isdissolving;
#include "/node_modules/lygia/generative/fbm.glsl"

vec2 laplacian(vec2 st, vec4 data){
    vec2 px = 1.0 / u_resolution;
    vec2 res = vec2(0.0);

    float w1 = 0.25;
    float w2 = 0.05;
    res += texture2D(tex, st + vec2(-1.0,  0.0) * px).rg * w1;
    res += texture2D(tex, st + vec2( 1.0,  0.0) * px).rg * w1;
    res += texture2D(tex, st + vec2( 0.0, -1.0) * px).rg * w1;
    res += texture2D(tex, st + vec2( 0.0,  1.0) * px).rg * w1;
    
    // res += texture2D(tex, st + vec2( -1.0,  -1.0) * px).rg * w2;
    // res += texture2D(tex, st + vec2( -1.0,  1.0) * px).rg * w2;
    // res += texture2D(tex, st + vec2( 1.0,  -1.0) * px).rg * w2;
    // res += texture2D(tex, st + vec2( 1.0,  1.0) * px).rg * w2;

    res += data.rg * -1.0;
    return res;
}


void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    float d = distance(st, vec2(0.5));
    float offset = (smoothstep(-0.5, .5, sin(u_time * 0.01 + d) * fbm(vec2(d))));
    // float offset = 0.;
    // float offset = 1.;
    float offset2 = (smoothstep(-.7, .7, cos(u_time * 0.01 - d) * fbm(vec2(0.2 - d))));


    // float diffusionRateA = 0.60 ;
    float diffusionRateA = mix(0.470, 0.60 + (0.07 * d ), offset);
    // float diffusionRateB = 0.15 ;
    float diffusionRateB = mix(0.22, 0.19 + (2.8 * d * offset2), offset);


    float growth = smoothstep(0., 1., offset2);


    float feed = mix(mix(0.025, 0.025, offset2) , mix(0.05, 0.065, offset), growth);
    // float feed = 0.005;
    float kill = mix(mix(0.056, 0.059, sin(offset2)) , mix(0.061, 0.0777, offset2), growth);

    vec4 data = texture2D(tex, st);
    float A = data.r;
    float B = data.g;

    vec2 laps = laplacian(st, data);


    // A' = A + (diffusion rate A *  2D Laplacian average of A - AB^2 + feed(1-A))
    float An = A + (diffusionRateA * laps.r - A* B*B + feed * (1. - A))  ;
    
    // B' = B + (diffusion rate B *  2D Laplacian average of B + AB^2 - (kill rate + feed) * B)
    float Bn = B + (diffusionRateB  * laps.g + A * B*B - (kill + feed) * B) ;
    gl_FragColor = vec4(An, Bn, offset2, 1.0);
}

