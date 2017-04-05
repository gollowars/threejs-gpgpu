export function getRandomSquare( width, height, size ){
  var len = width * height * 3
  var data = new Float32Array( len )
  while( len-- )data[len] = ( Math.random() -.5 ) * size 
  return data
}

export function makeSphere( radius, size ){

  let len = size*3
  let data = []
  for(let i = 0;i < size; i++){
    let v = new THREE.Vector3()
    v.x = Math.random() * 2 - 1
    v.y = Math.random() * 2 - 1
    v.z = Math.random() * 2 - 1

    v.normalize().multiplyScalar(radius)

    data[i*3] = v.x
    data[i*3+1] = v.y
    data[i*3+2] = v.z
  }

  return data
}

export function makeInnerSphere( radius, size ){

  let len = size*3
  let data = []
  for(let i = 0;i < size; i++){
    let v = new THREE.Vector3()
    v.x = Math.random() * 2 - 1
    v.y = Math.random() * 2 - 1
    v.z = Math.random() * 2 - 1

    let actRad = Math.random() * radius
    v.normalize().multiplyScalar(actRad)

    data[i*3] = v.x
    data[i*3+1] = v.y
    data[i*3+2] = v.z
  }

  return data
}

export function makeGrand( radius, size ){

  let data = []
  for(let i = 0;i < size; i++){
    let v = new THREE.Vector3()
    v.x = Math.random() * 2 - 1
    v.y = 0
    v.z = Math.random() * 2 - 1

    v.normalize().multiplyScalar(radius)

    data[i*3] = v.x
    data[i*3+1] = v.y
    data[i*3+2] = v.z
  }

  return data
}
let colors = [
  new THREE.Vector3(254/255,213/255,149/255),
  new THREE.Vector3(218/255,128/255,182/255),
  new THREE.Vector3(114/255,172/255,160/255),
]
export function makeColors(size){
  let data = []
  for(let i = 0;i < size; i++){
    let colorIndex = i % 3
    let v = colors[colorIndex]

    data[i*3] = v.x
    data[i*3+1] = v.y
    data[i*3+2] = v.z
  }

  return data
}



export function makePlane( width, height ){

  

  let data = []

  return data
}