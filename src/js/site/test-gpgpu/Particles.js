export default class Particles {
  constructor( width, height, renderer, simulationShader, renderShader ){
    this.width = width
    this.height = height
    this.renderer = renderer
    this.simulationShader = simulationShader
    this.renderShader = renderShader


    this.scene = null
    this.camera = null
    this.rtt = null
    this.particles = null

    this.init()
  }

  init(){
    let gl = this.renderer.getContext()

    if(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0){
      console.log('cannot use vertex texture image unit')
    }

    if( gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0 ) {
      throw new Error( "vertex shader cannot read textures" );
    }

    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 )
    let options = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat,
      type:THREE.FloatType
    }

    this.rtt = new THREE.WebGLRenderTarget( this.width,this.height, options)

    let geometry = new THREE.BufferGeometry()
    geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ]), 3 ) )
    geometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([   0,1, 1,1, 1,0,     0,1, 1,0, 0,0 ]), 2 ) )
    this.scene.add( new THREE.Mesh( geometry, this.simulationShader))

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
    this.renderer.render( this.scene, this.camera, this.rtt, true)
    this.particles.material.uniforms.positions.value = this.rtt
  }
}