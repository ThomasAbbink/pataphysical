#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#include "lygia/generative/fbm.glsl"

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.1294, 0.1294, 0.1569);

    // Use fbm for movement
    float dotFbmValue = fbm(st * 0.9 + u_time * 0.05);

    // Add wave-like movement to the cell center using fbm
    float waveX = sin(dotFbmValue) * 0.2;
    float waveY = cos(dotFbmValue) * 0.2;
    vec2 waveOffset = vec2(waveX, waveY);
    
    // Calculate the movement of the dot
    vec2 dotCenter = vec2(
        0.5 + 0.3 * cos(u_time * 0.2),
        0.5 + 0.3 * sin(u_time * 0.1)
    );
    
    // Calculate the distance from the moving dot center
    vec2 center = st - dotCenter + waveOffset;
    float distFromCenter = length(center);
    
    float dotSize = 0.09 - 0.1 * abs(sin(dotFbmValue));
    float glowSize = abs(sin(u_time * 0.02)) + 0.1;
    
    // Create the dot with a soft edge
    float dot = smoothstep(dotSize, dotSize - 0.01, distFromCenter);
    
    // Create the glow
    float glow = smoothstep(glowSize, dotSize, distFromCenter);
    
    // Define neon colors
    vec3 dotColor = vec3(0.0, 1.0, 1.0);  // Cyan
    vec3 glowColor = vec3(0.0, 0.5, 1.0); // Light blue
    
    // Add the dot and glow to the color
    color = mix(color, glowColor, glow * 0.6);  // Softer glow
    color = mix(color, dotColor, dot);          // Brighter center

    gl_FragColor = vec4(color, 1.0);
}