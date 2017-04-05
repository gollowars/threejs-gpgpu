export function getRandomData( width, height, size ){
  var len = width * height * 3
  var data = new Float32Array( len )
  while( len-- )data[len] = ( Math.random() -.5 ) * size 
  return data
}

export function getSide(vertices){
    var total = vertices.length;
    var side = parseInt( Math.sqrt( total * 3 ) + .5 );
    return side;
}

export function parseMesh(vertices){
    var total = vertices.length;
    var size = parseInt( Math.sqrt( total * 3 ) + .5 );
    var data = new Array( size*size*3 );
    for( var i = 0; i < total; i++ ) {
        data[i * 3] = vertices[i].x;
        data[i * 3 + 1] = vertices[i].y;
        data[i * 3 + 2] = vertices[i].z;
    }
    return data;
}

function getPoint(v,size)
{
  v.x = Math.random() * 2 - 1 ;
  v.y = Math.random() * 2 - 1 ;
  v.z = Math.random() * 2 - 1 ;
  if(v.length()>1)return getPoint(v,size);
  return v.normalize().multiplyScalar(size)
}

function getRandomPoint(v,size)
{
  v.x = Math.random() * 2 - 1 ;
  v.y = Math.random() * 2 - 1 ;
  v.z = Math.random() * 2 - 1 ;
  if(v.length()>1)return getRandomPoint(v,size);
  return v.normalize().multiplyScalar(Math.random()*size + Math.random()*size/2);
}

export function getSphere( count, size ){

    var len = count * 3;
    var data = new Float32Array( len );
    var p = new THREE.Vector3();
    for( var i = 0; i < len; i+=3 )
    {
        getPoint( p, size );
        data[ i     ] = p.x;
        data[ i + 1 ] = p.y;
        data[ i + 2 ] = p.z;
    }
    return data;
}


export function getRandomSphere( count, size ){

    var len = count * 3;
    var data = new Float32Array( len );
    var p = new THREE.Vector3();
    for( var i = 0; i < len; i+=3 )
    {
        getRandomPoint( p, size );
        data[ i     ] = p.x;
        data[ i + 1 ] = p.y;
        data[ i + 2 ] = p.z;
    }
    return data;
}