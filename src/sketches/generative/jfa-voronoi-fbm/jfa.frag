#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_offset;
uniform sampler2D tex;

float distSq(vec2 uv, vec2 seedUv) {
    vec2 d = (uv - seedUv) * u_resolution;
    return dot(d, d);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;


    vec2 bestCoord = vec2(0.0);
    float bestDist = 1.0 / 0.0;

    for (int i = -1; i < 2; i++) {
        for (int j = -1; j < 2; j++) {
            vec2 xy = st + vec2(float(i), float(j)) * u_offset / u_resolution;
            vec4 cell = texture2D(tex, xy);
            if (cell.b > 0.5) {
                float d = distSq(st, cell.rg);
                if (d < bestDist) {
                    bestDist = d;
                    bestCoord = cell.rg;
                }
            }
        }
    }

    if (bestDist < 1.0 / 0.0) {
        gl_FragColor = vec4(bestCoord, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0);
    }
}