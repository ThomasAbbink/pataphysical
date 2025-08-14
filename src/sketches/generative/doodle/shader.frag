#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex1;
const float scale = 3.5;

// Distance (in pixels) sampled around point.
const int smpDst = 2;
const float pVel = 0.0006;
const float frmAdj = 0.1;
const float spawnRate = 0.0001;

#include "/node_modules/lygia/generative/fbm.glsl";
#include "/node_modules/lygia/generative/random.glsl";

vec2 inverseResolution;
// Much of the code in sc(), ss(), and mainImage() is derived from davidar's
// wind flow map https://www.shadertoy.com/view/4sKBz3
vec2 sc(vec2 pos) {
    for(int i = -smpDst; i <= smpDst; i++) {
        for(int j = -smpDst; j <= smpDst; j++) {
        
            // These two lines subtract the current fragCoord's position (pos) from the sum
            // of the previous frame's pixel coordinate and its velocity at the sampled point (res)
            // which is stored in the .xy component of the buffer to get a velocity vector
            // relative to the sampled point, then checks whether that vector points to the
            // center of the current pixel or not.
            vec2 res = texture2D(u_tex1,(pos + vec2(i,j)) * inverseResolution).xy;
            if(all(lessThan(abs(res - pos), vec2(0.5)))) return res;
        }
    }
    return vec2(0.0);
}

vec3 ss(vec2 pos, vec2 scr) {
    vec2 uv0 = pos * inverseResolution.x;
    
    vec2 uv1 = scale * (scr - 0.5 * u_resolution.xy) * inverseResolution.y;
    
    float frame = float(u_time);
    vec4 hash = random4(pos * frame);
    
    // This adds random particles with a random initial velocity offset.
    scr = (hash.w > 0.9) ? (pos + hash.xy) : scr;
    
    // The velocity field.
    float v = fbm(vec3(uv1, -3875.27)) * pVel * frmAdj;
    
    // This just adds the position and velocity of the particle that will move into the current pixel to its new velocity.
    // Every on-screen particle at this point except for the one occupying the bottom-leftmost pixel
    // will have a value greater than zero and thus will persist into the next frame,
    // and likewise the resulting sum of the particle's position and its velocity and the new velocity will
    // always be greater than 1.0, which, when put into a vector whose .b component is 1.0, makes it white.
    // return vec3(0.0);
    return (any(greaterThan(scr, vec2(0.0)))) ? vec3(scr + vec2(v), 1.0) : vec3(0.0);
}

void main() {
    vec2 st = (2.0*gl_FragCoord.xy - u_resolution.xy)/u_resolution.y;
    //  vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 inverseResolution = 1.0 / u_resolution.xy;
    vec2 uv = gl_FragCoord.xy * inverseResolution;

    vec2 scRes = sc(gl_FragCoord.xy);
    vec3 res = ss(uv, scRes);



    gl_FragColor = vec4(res, 1.0);
}