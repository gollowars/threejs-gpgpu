uniform float alpha;
uniform vec2 nearFar;

varying float size;
varying vec3 vColor;

#ifdef USE_LOGDEPTHBUF
  uniform float logDepthBufFC;
  #ifdef USE_LOGDEPTHBUF_EXT
    varying float vFragDepth;
  #endif
#endif
void main()
{

  float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
  if ( f > 0.1 ) {
      discard;
  }

  #if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)
      gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;
  #endif

  #ifdef USE_LOGDEPTHBUF_EXT
      float depth = gl_FragDepthEXT / gl_FragCoord.w;
  #else
      float depth = gl_FragCoord.z / gl_FragCoord.w;
  #endif

  float color = 1.0 - smoothstep( nearFar.x, nearFar.y, depth );
  // gl_FragColor = vec4( vec3( color ), 0.25 );

  vec3 distColor = vec3(mix(vColor.x,color,0.5), mix(vColor.y,color,0.5),mix(vColor.z,color,0.5));
  gl_FragColor = vec4( distColor, alpha );
}