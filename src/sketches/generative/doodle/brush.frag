#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_brush;
uniform float u_brushCrop;
uniform vec3 u_color;
uniform float u_progress;
uniform float u_brushAngle;
varying vec2 vTexCoord;
uniform float u_inkLow;
uniform float u_inkHigh;

void main() {
    vec2 uv= vTexCoord - 0.5;
    float a  = radians(u_brushAngle);
    uv= mat2(cos(a), -sin(a),sin(a), cos(a)) *uv;
    uv.x *= u_brushCrop;
    uv += 0.5;
    vec3 tex = texture2D(u_brush, uv).rgb;

    float ink = 1.0 - dot(tex, vec3(0.2126, 0.7152, 0.0722));
    float profile = smoothstep(0.65, 0.9, ink);

    float head = 1.0 - smoothstep(u_progress - 0.06, u_progress, vTexCoord.y);
    float alpha = profile * head;

    gl_FragColor = vec4(u_color / 255.0 * alpha, alpha);

}