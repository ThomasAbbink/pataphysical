#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D tex;
uniform sampler2D u_image;
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

vec2 dirField(vec2 st) {
    vec2 d = st - vec2(0.5);
    
    float len = length(d);
    // avoid NaN at exact center
    return len < 1e-4 ? vec2(1.0, 0.0) : d / len;
}

vec2 anisotropicLaplacian8(vec2 st, vec4 data, vec2 d, float anisotropy) {
    vec2 px = 1.0 / u_resolution;
    vec2 res = vec2(0.0);
    float wSum = 0.0;
    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            if (i == 0 && j == 0) continue;
            vec2 offset = vec2(float(i), float(j));
            vec2 dir = normalize(offset);
            // 1 along d, 0 across → raised by anisotropy
            float align = abs(dot(dir, d)); // 0..1
            float w = mix(1.0 / anisotropy, anisotropy, align * align);
            // optional: slightly favor orthogonals over corners
            w *= (i == 0 || j == 0) ? 1.0 : 0.7;
            res += texture2D(tex, st + offset * px).rg * w;
            wSum += w;
        }
    }
    res /= wSum;
    res -= data.rg;
    return res;
}


vec2 advect(vec2 st, vec2 vel, float strength) {
    vec2 px = 1.0 / u_resolution;
    return texture2D(tex, st - vel * px * strength).rg;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    // u_image is glasses.jpg, stretched to the sim. flip y if it looks upside down:
    // vec2 imgSt = vec2(st.x, 1.0 - st.y);
    vec4 img = texture2D(u_image, vec2(st.x, 1.-st.y));
    float imgLuma = dot(img.rgb, vec3(0.299, 0.587, 0.114));
    // feed = mix(feed, 0.03, imgLuma);
    // Bn = max(Bn, (1.0 - imgLuma) * 0.4);
    vec2 target = vec2((.5 + fbm(vec2(u_time * 0.001, u_seed)/ 2.) ), 1.0);
    vec2 origin = vec2(0.5, 0.0);
    float d_to_origin = distance(st, origin);
    float d_to_target = distance(st, target);

    float d_from_middle = distance(st, vec2(0.5, st.y)) * 2.;
    float s = mix(0., smoothstep(-1., 1. ,fbm(vec2(u_time* 0.001,4.1 * u_seed))), d_to_target);
    // float s  = 0.;
    float t = smoothstep(0.00, 3.5, d_to_origin + d_from_middle + s *2.);
    float laplacian_correction = mix(0.65, 0.65 , d_to_target);



    // if(d_to_origin  >  1.0 + fbm(vec2(u_seed)) / 2. ){
    //     t = smoothstep(.95, 0.00, d_to_origin);
    // }
  
    // float diffusionRateA = 0.60 ;
    float diffusionRateA = mix( 0.6, 1.0, t ) * laplacian_correction;


    // float diffusionRateB = 0.15 ;

    float diffusionRateB = mix( 0.351, 0.464, t ) * laplacian_correction;


    float feed = mix(0.0691, 0.041, t) ;
    float kill = mix(0.055, 0.075,  t);


    if(u_time> 20.){

    feed = mix(feed, 0.065, (1.0 - imgLuma));
    kill = mix(kill, 0.065, (1.0 - imgLuma));
    // diffusionRateA = mix(0.5, diffusionRateA, smoothstep(0.0, 0.5, d_from_middle) );
    diffusionRateA = mix(0.2, diffusionRateA, smoothstep(0.0, 0.2, d_to_target) );
    }

    vec4 data = texture2D(tex, st);
    vec2 toTop = target - st;

    vec2 vel = length(toTop) < 1e-4 ? vec2(1.0, 0.0): normalize(toTop);
    // float flow = 0.001+  0.008 * st.y ; 
    // float flow = mix(-0.002, 0.008 ,st.y); 
    float flow = 0.004; 
    vec2 adv = advect(st, vel, flow);
    float A = mix(data.r, adv.r, 0.5);
    float B = mix(data.g, adv.g, 0.8);


    float anisotropy = mix(2.0, 4.0, smoothstep(0.05, 0.3, st.y));
    vec2 laps = anisotropicLaplacian8(st, data, normalize(target), anisotropy);
    // vec2 laps = laplacian(st, data);



    // A' = A + (diffusion rate A *  2D Laplacian average of A - AB^2 + feed(1-A))
    float An = A + (diffusionRateA * laps.r - A* B*B + feed * (1. - A)) * mix(0.7, 1.35, d_to_target);
    
    // B' = B + (diffusion rate B *  2D Laplacian average of B + AB^2 - (kill rate + feed) * B)
    float Bn = B + (diffusionRateB  * laps.g + A * B*B - (kill + feed) * B) *  mix(0.7, 1.35, d_to_target) ;


    float p = floor(origin.x * 1000.0) + origin.y;  // y in [0,1]

    gl_FragColor = vec4(An, Bn, p, 1.0);
}

