precision mediump float;
varying vec3 vColor;
void main() {
    // vec3 pos = texture2D( positions, vUv ).rgb;
    vec4 c = vec4( vColor,1.0 );
    gl_FragColor = c;
}