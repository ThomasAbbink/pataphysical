#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D tex;
uniform float u_time;
uniform bool u_isdissolving;
uniform float u_seed;
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
    float movement_speed = 0.002 * u_seed;
    float x = fbm(vec2(u_time * movement_speed , u_seed)) * 0.5 + 0.5;
    float y = fbm(vec2( u_seed, -u_time * movement_speed)) * 0.5 + 0.5;
    float d_to_creature = distance(st, vec2(x, y));
    float d_to_center = distance(st, vec2(0.5));

    float laplacian_correction = mix(0.65, 0.55 , d_to_creature);
    float t = smoothstep(0.00, 0.95, d_to_creature);

    if(d_to_creature  >  1.0 + fbm(vec2(u_seed)) / 2. ){
        t = smoothstep(.95, 0.00, d_to_creature);
    }
  
    // float diffusionRateA = 0.60 ;
    float diffusionRateA = mix( 0.7, 1.0, t ) * laplacian_correction ;

    // float diffusionRateB = 0.15 ;
    float diffusionRateB = mix( 0.41, 0.465, t ) * laplacian_correction;


    float feed = mix(0.0691, 0.061, t) ;
    float kill = mix(0.06, 0.065,  t);
  
    float interval = 2000.;
    float duration = 100. + 100. * u_seed;
    float isDissolving = mod(u_time, interval);
    if(u_time > 200. && isDissolving < duration ){

        float dissolveT = smoothstep(0.0, 1.0, isDissolving / duration);
        float killRate = mix(0.065, 0.09, dissolveT);

        diffusionRateA -= 0.01;
        kill = mix(0.06,killRate, d_to_center);
    }

    vec4 data = texture2D(tex, st);
    float A = data.r;
    float B = data.g;

    vec2 laps = laplacian(st, data);


    // A' = A + (diffusion rate A *  2D Laplacian average of A - AB^2 + feed(1-A))
    float An = A + (diffusionRateA * laps.r - A* B*B + feed * (1. - A)) * mix(1.35, 1.0, d_to_creature);
    
    // B' = B + (diffusion rate B *  2D Laplacian average of B + AB^2 - (kill rate + feed) * B)
    float Bn = B + (diffusionRateB  * laps.g + A * B*B - (kill + feed) * B)  *  mix(1.35, 1.0, d_to_creature);

    float p = floor(x * 1000.0) + y;  // y in [0,1]

    gl_FragColor = vec4(An, Bn, p, 1.0);
}

