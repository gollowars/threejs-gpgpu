////////////////////////
// Utils
import { getRandomData, parseMesh, getSphere, getRandomSphere} from './utils/Utils'
import FBO from './utils/fbo'
import _ from 'lodash'
////////////////////////
// Models


////////////////////////
// Shaders
import dataVs from '../../../glsl/askw/testvtf/data_vs.glsl'
import dataFs from '../../../glsl/askw/testvtf/data_fs.glsl'

import simuVs from '../../../glsl/basic/simulation_vs.glsl'
import simuFs from '../../../glsl/basic/simulation_fs.glsl'

import renderVs from '../../../glsl/basic/render_vs.glsl'
import renderFs from '../../../glsl/basic/render_fs.glsl'

export default class TestParticleTexture {
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
    this.camera = new THREE.PerspectiveCamera(60,w/h, 1,10000 );
    this.camera.position.z = 10
    // this.controls = new THREE.OrbitControls(this.camera)
    // this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)

    // vertexshaderからtextureが利用できるかcheck
    let gl = this.renderer.getContext()
    if(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS == 0)){
      console.log('cannot use vertex texture image unit')
    }

    
    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }


  render(){
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