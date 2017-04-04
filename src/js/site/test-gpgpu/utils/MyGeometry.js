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



export function makePlane( width, height ){

  

  let data = []

  return data
}