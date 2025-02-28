#ifdef GL_ES
precision mediump float;
#endif

// Import fbm from Lygia
#include "/node_modules/lygia/generative/fbm.glsl"

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.1294, 0.1294, 0.1569);

    // Number of tentacles
    const int numLines = 100;
    
    // Base line width (thicker lines)
    float baseLineWidth = 3.0 / u_resolution.x;
    
    // For each tentacle
    for(int i = 0; i < numLines; i++) {
        // Calculate position with non-uniform spacing
        float t = float(i) / float(numLines - 1);
        
        // Restrict tentacles to the center portion of the screen
        // Map t from [0,1] to [0.2,0.8] to leave edges empty
        float centerMargin = 0.1; // 20% margin on each side
        float restrictedT = mix(centerMargin, 1.0 - centerMargin, t);
        
        // Add some non-uniform variation within the center area
        float linePosition = restrictedT + 0.04 * sin(t * 6.28) + 0.02 * sin(t * 12.56);
        
        // Ensure linePosition stays within our desired range
        linePosition = clamp(linePosition, centerMargin, 1.0 - centerMargin);
        
        // Normalize y coordinate for the full screen height
        float normalizedY = st.y;
        
        // Vary the amplitude slightly for each tentacle
        float amplitude = 0.25 + normalizedY / 3.0;
        amplitude *= 1.2 + 0.8 * sin(linePosition * 6.28 + u_time * 0.5);
        
        // Create a variable speed for the frequency change
        float timeScale = 1.0 + 1.5 * fbm(vec2(u_time * 0.2 + linePosition, 0.0));
        
        // Combine slow and fast movements with phase offset based on position
        float slowComponent = sin(u_time * 0.5 + linePosition * 5.0);
        float fastComponent = sin(u_time * 3.0 + linePosition * 4.0);
        
        // Mix between slow and fast movement
        float mixFactor = 0.5 + 0.5 * sin(u_time * 0.15 + linePosition);
        float frequency = 0.8 * mix(slowComponent, fastComponent, mixFactor) * normalizedY;

        // Calculate the center of this tentacle
        float baseX = linePosition;
        float waveCenterX = baseX + amplitude * frequency * 0.5;
        
        // Vary line width slightly
        float lineWidth = baseLineWidth * (1.2 + 0.6 * sin(linePosition * 8.0));
        
        // Calculate distance to the wave center for glow effect
        float distToCenter = abs(st.x - waveCenterX);
        
        // Create a wider glow effect with time-based variation
        float glowPulse = 8.0 + 4.0 * sin(u_time * 0.8 + linePosition * 6.28);
        float glowWidth = lineWidth * glowPulse;
        float glow = smoothstep(glowWidth, 0.0, distToCenter);
        
        // Apply vertical fade to the glow - stronger at the bottom, fading as it goes up
        float verticalFade = smoothstep(1.0, 0.0, st.y);
        glow *= mix(0.6, 1.0, verticalFade);
        
        // Create the main line with smooth edges
        float line = smoothstep(waveCenterX - lineWidth/2.0, waveCenterX, st.x) - 
                     smoothstep(waveCenterX, waveCenterX + lineWidth/2.0, st.x);
        
        // Vary color slightly based on position
        vec3 neonColor = vec3(1.0, 0.41, 0.0);
        // Add slight hue variation
        neonColor = mix(neonColor, vec3(1.0, 0.2, 0.6), sin(linePosition * 3.14) * 0.5 + 0.5);
        
        // Apply the glow and the line
        color = mix(color, neonColor * 0.7, glow * 0.7);
        color = mix(color, neonColor, line);
    }

    gl_FragColor = vec4(color, 1.0);
}