
//float texture containing the positions of each particle
uniform sampler2D positions;
uniform sampler2D velocity;
uniform float time;

//size
uniform float pointSize;

void main() {

    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, position.xy ).xyz;
    vec3 vel = texture2D( velocity, position.xy ).xyz;
    pos += vel*time;
    //pos now contains the position of a point in space taht can be transformed
    vec4 distPosition =  modelViewMatrix * vec4( pos, 1.0 );

    float size = pointSize * (100.0 / length(distPosition.xyz));

    gl_PointSize = size;
    gl_Position = projectionMatrix * distPosition;
}