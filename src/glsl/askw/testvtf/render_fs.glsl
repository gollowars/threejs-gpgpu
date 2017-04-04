void main()
{
  float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
  if ( f > 0.1 ) {
      discard;
  }
  gl_FragColor = vec4( vec3( 0.0 , 1.0, 1.0 ), .35 );
}