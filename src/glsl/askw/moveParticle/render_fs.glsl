varying vec3 vColor;
uniform float alpha;

void main()
{

  float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
  if ( f > 0.1 ) {
      discard;
  }
  gl_FragColor = vec4( vColor, alpha );
}