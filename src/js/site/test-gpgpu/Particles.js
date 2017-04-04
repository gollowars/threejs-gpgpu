import DataTexture from './DataTexture'

export default class Particles {
  constructor( width, height, renderer, simulationShader, renderShader ){
    this.width = width
    this.height = height
    this.renderer = renderer
    this.simulationShader = simulationShader
    this.renderShader = renderShader


    this.dataTexture = null
    this.scene = null
    this.camera = null
    this.rtt = null
    this.particles = null

    this.init()
  }

  init(){
    Logger.debug(DataTexture)
    this.dataTexture = new DataTexture(this.width, this.height, this.renderer,this.simulationShader)

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