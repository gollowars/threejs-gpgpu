
//float texture containing the positions of each particle
uniform sampler2D positions;
uniform sampler2D velocity;
uniform sampler2D modelPosition;
uniform sampler2D colors;
uniform float time;
uniform float speed;
uniform float mixAmount;
uniform float humanSize;

varying vec3 vColor;
//size
uniform float pointSize;

#define EPSILON 1e-6
#ifdef USE_LOGDEPTHBUF
  #ifdef USE_LOGDEPTHBUF_EXT
    varying float vFragDepth;
  #endif
  uniform float logDepthBufFC;
#endif
void main() {

    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 color = texture2D( colors, position.xy ).xyz;
    vColor = color;
    vec3 particlePosition = texture2D( positions, position.xy ).xyz;
    vec3 vel = texture2D( velocity, position.xy ).xyz;
    vel *= vec3(speed);
    particlePosition += vel*time;
    //pos now contains the position of a point in space taht can be transformed

    vec3 destination = texture2D( modelPosition, position.xy ).xyz;
    destination *= humanSize;
    vec3 pos = mix( particlePosition, destination, mixAmount);

    vec4 distPosition =  modelViewMatrix * vec4( pos, 1.0 );
    float size = pointSize * (100.0 / length(distPosition.xyz));

    gl_PointSize = size;
    gl_Position = projectionMatrix * distPosition;

    #ifdef USE_LOGDEPTHBUF
        gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;

        #ifdef USE_LOGDEPTHBUF_EXT
            vFragDepth = 1.0 + gl_Position.w;
        #else
            gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
        #endif
    #endif
}