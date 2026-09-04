#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform sampler2D u_image;
uniform float u_radius;

void main(){
    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 texel = 1.0  / u_resolution;
    vec4 sum = vec4(0.0);
    float total = 0.0;
    
    for (int i = -6; i<= 6; i++){
        for (int j = -6; j <= 6; j++){
            vec2 o = vec2(float(i), float(j)) * texel * u_radius / 6.0;

            float w = exp(-float(i*i + j*j) / 18.0);
            sum += texture2D(u_image, st + o ) * w;
            total += w;
        }
    }

    gl_FragColor = sum / total;
}