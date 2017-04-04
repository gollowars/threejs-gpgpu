////////////////////////
// Utils
import _ from 'lodash'
import { makeSphere, makePlane } from './utils/MyGeometry'
import { getRandomData } from './utils/Utils'
import Particles from './Particles'
import MoveParticles from './MoveParticles'

////////////////////////
// Models


////////////////////////
// Shaders

import renderVertShader from '../../../glsl/askw/moveParticle/render_vs.glsl'
import renderFragShader from '../../../glsl/askw/moveParticle/render_fs.glsl'

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

    this.clock = new THREE.Clock()

    let w = this.w
    let h = this.h

    // Base Scene Rendering
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60,w/h, 1,10000 )
    this.camera.position.z = 520
    // this.controls = new THREE.OrbitControls(this.camera)
    // this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)


    // gpgpu 用意
    let side = 60
    let sphereData = makeSphere(100.0, side*side)

    let renderShader = new THREE.ShaderMaterial({
      uniforms:{
        positions:{ type: "t", value: null},
        pointSize: { type: "t", value: 100},
        velocity: { type: "t", value: null},
        time: { type: "f", value: null}
      },
      vertexShader: renderVertShader,
      fragmentShader: renderFragShader,
      transparent: true,
      blending: THREE.AdditiveBlending
    })


    this.particleObj = new MoveParticles(sphereData ,this.renderer, renderShader)
    this.scene.add( this.particleObj.particles )


    this.last = window.performance.now()
    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }


  render(){
    let now = window.performance.now()
    let delta = (now - this.last) / 1000
    if (delta > 1) delta = 1
    let time = now/1000
    this.last = now


    // Logger.debug('now :',now)
    // Logger.debug('delta :',delta)
    // Logger.debug('time :',time)

    this.particleObj.update(time)
    // this.camera.rotation.y += Math.PI/180 * 1
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