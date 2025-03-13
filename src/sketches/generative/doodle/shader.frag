#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// Rotate UV coordinates around the origin
vec2 rotateUV(vec2 uv, float angle) {
    vec2 rotatedUV;
    rotatedUV.x = uv.x * cos(angle) - uv.y * sin(angle);
    rotatedUV.y = uv.x * sin(angle) + uv.y * cos(angle);
    return rotatedUV;
}

// Draw a tile with a white square at the center
float drawTile(vec2 uv, float variant) {    
    // Draw a square at the center of the cell
    float squareSize = 0.707; // Size of the square (0.5 means half the cell width)

    float color = 0.0;
    // Check if the UV coordinates are within the square boundaries
    if (abs(uv.x) < squareSize * 0.5 && abs(uv.y) < squareSize * 0.5) {
        color = 1.0; // White square
    }

    // if(variant == 1.0) {
    //   return 1.0 - color;
    // }
    
    return color;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.1294, 0.1294, 0.1569);

    // Create an 8x8 grid
    float gridSize = 8.0;
    float timeFactor = 0.8;
    
    // Modified time-based offsets to only move in one direction
    // For rows: only move right (positive direction)
    float rowOffset = max(0.0, sin(u_time * timeFactor));
    
    // For columns: only move up (positive direction)
    float colOffset = max(0.0, sin(u_time * timeFactor + 3.14159 / 2.0));
    
    // Apply pause at the apex
    float pauseThreshold = 0.40;
    
    float rowPausedOffset;
    if (rowOffset > pauseThreshold) {
        rowPausedOffset = 1.0; // Hold at maximum
    } else {
        rowPausedOffset = rowOffset / pauseThreshold; // Rescale
    }
    
    float colPausedOffset;
    if (colOffset > pauseThreshold) {
        colPausedOffset = 1.0; // Hold at maximum
    } else {
        colPausedOffset = colOffset / pauseThreshold; // Rescale
    }
    
    // Scale offsets to appropriate range (0 to 0.5)
    float rowTimeOffset = rowPausedOffset * 0.5;
    float colTimeOffset = colPausedOffset * 0.5;
    
    // Offset uneven rows and columns
    vec2 stOffset = st;
    
    // Row offset - only move right
    float rowIndex = floor(st.y * gridSize);
    if (mod(rowIndex, 2.0) == 1.0) {
        // Offset odd rows by 0.5 grid cells plus time-based offset (only positive)
        stOffset.x += (0.5 / gridSize) + (rowTimeOffset / gridSize);
    }
    
    // Column offset - only move up
    float colIndex = floor(st.x * gridSize);
    if (mod(colIndex, 2.0) == 1.0) {
        // Offset odd columns by 0.5 grid cells plus time-based offset (only positive)
        stOffset.y += (0.5 / gridSize) + (colTimeOffset / gridSize);
    }
    
    vec2 grid = fract(stOffset * gridSize);
    
    // Store the grid for border calculation later
    vec2 gridForBorder = grid;
    
    // Center each cell
    vec2 uv = grid - 0.5;
    
    // Calculate rotation based on row and column movement
    float rotationAngle = 0.0;
    
    // When rows are moving, rotate clockwise up to 90 degrees
    if (rowOffset < pauseThreshold) {
        // Map rowOffset from 0 to pauseThreshold to 0 to PI/2 (90 degrees)
        float normalizedProgress = rowOffset / pauseThreshold;
        rotationAngle = normalizedProgress * (3.14159 / 2.0);
    } 

    // When cols are moving, rotate clockwise up to 90 degrees
    if (colOffset < pauseThreshold) {
        // Map colOffset from 0 to pauseThreshold to 0 to PI/2 (90 degrees)
        float normalizedProgress = colOffset / pauseThreshold;
        rotationAngle = normalizedProgress * (3.14159 / 2.0);
    }
    
    // Determine tile variant based on position
    // This creates a checkerboard pattern of tile variants
    float variant = mod(rowIndex + colIndex, 2.0);
    vec2 rotatedUV = rotateUV(uv, rotationAngle);

    // Draw the Truchet tile
    float truchetPattern = drawTile(rotatedUV, variant);
    
    // Apply the pattern to the color
    vec3 patternColor = vec3(1.0);
    color = mix(color, patternColor, truchetPattern);
    
    // // Add debug grid borders
    // float borderWidth = 0.02;
    // float debugBorder = step(1.0 - borderWidth, gridForBorder.x) + step(1.0 - borderWidth, gridForBorder.y);
    // color = mix(color, vec3(1.0), debugBorder);

    gl_FragColor = vec4(color, 1.0);
}