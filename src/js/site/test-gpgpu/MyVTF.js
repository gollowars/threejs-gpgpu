////////////////////////
// Utils
import _ from 'lodash'
import { makeSphere, makePlane } from './utils/MyGeometry'
import { getRandomData } from './utils/Utils'
////////////////////////
// Models


////////////////////////
// Shaders
import vglsl from '../../../glsl/askw/testvtf/data_vs.glsl'
import fglsl from '../../../glsl/askw/testvtf/data_fs.glsl'

import simulationVertShader from '../../../glsl/askw/testvtf/simulation_vs.glsl'
import simulationFragShader from '../../../glsl/askw/testvtf/simulation_fs.glsl'
import renderVertShader from '../../../glsl/askw/testvtf/render_vs.glsl'
import renderFragShader from '../../../glsl/askw/testvtf/render_fs.glsl'

export default class MyVTF {
  constructor(){

    this.scene = null
    this.camera = null
    this.renderer = null
    this.startTime = new Date()
    this.animationID = null

    this.scale = 10

    this.init()
  }

  init(){
    Logger.debug("==========TestVTR INIT")
    this.startTime = new Date()
    this.prev = this.startTime
    this.timeCount = 0

    this.w = $(window).width()
    this.h = $(window).height()

    let w = this.w
    let h = this.h

    // Base Scene Rendering
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60,w/h, 1,10000 )
    this.camera.position.z = 50
    // this.controls = new THREE.OrbitControls(this.camera)
    // this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)


    // gpgpu 用意
    let side = 256
    let data = new Float32Array(makeSphere(10.0, side*side))
    let positions = new THREE.DataTexture(data, side, side, THREE.RGBFormat, THREE.FloatType)
    positions.needsUpdate = true


    let simulationShader = new THREE.ShaderMaterial({
      uniforms: {
        positions: { type: "t", value: positions}
      },
      vertexShader: simulationVertShader,
      fragmentShader: simulationFragShader
    })

    let renderShader = new THREE.ShaderMaterial({
      uniforms:{
        positions:{ type: "t", value: null},
        pointSizse: { type: "t", value: 2}
      },
      vertexShader: renderVertShader,
      fragmentShader: renderFragShader,
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    // vertexshaderからtextureが利用できるかcheck
    let gl = this.renderer.getContext()

    if(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0){
      console.log('cannot use vertex texture image unit')
    }

    if( gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0 ) {
      throw new Error( "vertex shader cannot read textures" );
    }

    let rttScene = new THREE.Scene()
    let rttCamera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 )
    var options = {
            minFilter: THREE.NearestFilter,//important as we want to sample square pixels
            magFilter: THREE.NearestFilter,//
            format: THREE.RGBFormat,//could be RGBAFormat
            type:THREE.FloatType//important as we need precise coordinates (not ints)
        };
    let rtt = new THREE.WebGLRenderTarget( side,side, options)

    let rttgeom = new THREE.BufferGeometry()
    rttgeom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array([   -1,-1,0, 1,-1,0, 1,1,0, -1,-1, 0, 1, 1, 0, -1,1,0 ]), 3 ) )
    rttgeom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([   0,1, 1,1, 1,0,     0,1, 1,0, 0,0 ]), 2 ) )
    rttScene.add( new THREE.Mesh( rttgeom, simulationShader))
    // rttgeom.computeBoundingSphere()

    let l = (side * side )
    let vertices = new Float32Array( l * 3 )
    for ( let i = 0; i < l; i++ ) {
      let i3 = i * 3
      vertices[ i3 ] = ( i % side ) / side 
      vertices[ i3 + 1 ] = ( i / side ) / side
    }

    let particleGeo = new THREE.BufferGeometry()
    particleGeo.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3))
    let particles = new THREE.Points( particleGeo, renderShader )

    this.renderer.render( rttScene, rttCamera, rtt, true )
    particles.material.uniforms.positions.value = rtt

    this.scene.add( particles )

    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }


  render(){
    // this.mesh.rotation.x += Math.PI/180 * 1
    // this.mesh.rotation.y += Math.PI/180 * 1
    // this.mesh.rotation.z += Math.PI/180 * 1
    // FBO.update()

    this.renderer.render(this.scene, this.camera)
  }


  update(){
    this.animationID = requestAnimationFrame(()=>{this.update()})
    this.render()
  }

  onResize(){
    Logger.debug("onResize")
    
    this.w = $(window).width()
    this.h = $(window).height()

    let w = this.w
    let h = this.h
    this.renderer.setSize(w,h)
    this.camera.aspect = w/h
    this.camera.updateProjectionMatrix()
  }

  destroy(){
    window.cancelAnimationFrame(this.animationID)
  }
}