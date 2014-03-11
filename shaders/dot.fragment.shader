precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D uSampler;
uniform int uWindow;
uniform vec2 uSizes;
void main() {
    vec2 onePixel = 1.0 / uSizes;
    
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    for (int i = 0; i != -1; i++) {
        if (i == uWindow) {
            break;
        }
        color += (texture2D(uSampler, vec2(vTexCoord.x - float(i + 1 - uWindow)*onePixel.x, vTexCoord.y - float(i + 1 - uWindow)*onePixel.y)) / float(uWindow));
//        color += (texture2D(uSampler, vec2(vTexCoord.x - float(i - 1 + uWindow)*onePixel.x, vTexCoord.y - float(i)*onePixel.y)) / float(uWindow));
    }
    gl_FragColor = color;
}
