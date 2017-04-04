precision mediump float;
attribute float index;
attribute float vertexIndex;
uniform float side;
uniform float quality;
varying vec3 vColor;

void main() {
  float frag = 1.0 / side;
  float texShift = 0.5 * frag;

  vColor = (normalize(position) + 1.0) * 0.5;
  float pu = fract(vertexIndex * frag) * 2.0 - 1.0;
  float pv = floor(vertexIndex * frag) * frag * 2.0 - 1.0;

  vec3 distPos = vec3((pu + texShift), (pv + texShift), 0.0);
  // gl_Position = vec4(pu + texShift, pv + texShift, 0.0, 1.0);
  // gl_Position = modelViewMatrix * vec4( distPos, 1.0 );

  vec4 modelViewPosition = modelViewMatrix * vec4(distPos, 1.0);
  gl_PointSize = quality;
  gl_Position = projectionMatrix * modelViewPosition;
}