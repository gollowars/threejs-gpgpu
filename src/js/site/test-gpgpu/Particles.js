import DataTexture from './DataTexture'

export default class Particles {
  constructor( data, renderer, renderShader ){
    this.data = data
    this.width = Math.sqrt(this.data.length/3)
    this.height = Math.sqrt(this.data.length/3)
    this.renderer = renderer

    // this.simulationShader = simulationShader
    this.renderShader = renderShader

    this.dataTexture = null
    this.scene = null
    this.camera = null
    this.rtt = null
    this.particles = null

    this.init()
  }

  init(){
    this.dataTexture = new DataTexture(this.data, this.renderer)

    let l = (this.width * this.height )
    let vertices = new Float32Array( l * 3 )
    for ( let i = 0; i < l; i++ ) {
      let i3 = i * 3
      vertices[ i3 ] = ( i % this.width ) / this.width 
      vertices[ i3 + 1 ] = ( i / this.height ) / this.height
    }

    let particleGeo = new THREE.BufferGeometry()
    particleGeo.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3))
    this.particles = new THREE.Points( particleGeo, this.renderShader )

  }

  update(){
    this.particles.material.uniforms.positions.value = this.dataTexture.getTexture()
  }
}