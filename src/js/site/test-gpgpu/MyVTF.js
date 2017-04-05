////////////////////////
// Utils
import _ from 'lodash'
import { makeSphere, makeGrand, makeInnerSphere,makeColors } from './utils/MyGeometry'
import { getRandomData } from './utils/Utils'
import Particles from './Particles'
import MoveParticles from './MoveParticles'
import DataTexture from './DataTexture'

////////////////////////
// Models


////////////////////////
// Shaders

import renderVertShader from '../../../glsl/askw/moveParticle/render_vs.glsl'
import renderFragShader from '../../../glsl/askw/moveParticle/render_fs.glsl'


////////////////////////
// Params
class Params {
  constructor(){
    this.alpha = 0.7
    this.speed = 5.0
  }
}

export default class MyVTF {
  constructor(){

    this.scene = null
    this.camera = null
    this.renderer = null
    this.startTime = new Date()
    this.animationID = null
    this.scale = 10

    this.params = null
    this.gui = null

    this.guiInit()
    this.init()
  }

  guiInit(){
    this.params = new Params()
    this.gui = new dat.GUI()
    this.gui.add(this.params, 'alpha', 0, 1.0)
    this.gui.add(this.params, 'speed', 0, 20.0)
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
    this.scene.background = new THREE.Color( 0xffffff )

    // this.scene.background = new THREE.Color( 0xffffff )
    this.camera = new THREE.PerspectiveCamera(60,w/h, 1,10000 )
    this.camera.position.z = 100
    // this.controls = new THREE.OrbitControls(this.camera)
    // this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true})
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)


    // gpgpu 用意
    let side = 126/2
    let verticalData = getRandomData(side, side, 300)
    let velocityData = makeInnerSphere(1, side*side)
    let colorData = makeColors(side*side)
    let velocityTexture = new DataTexture(velocityData, this.renderer)
    let colorDataTexture = new DataTexture(colorData, this.renderer)

    let renderShader = new THREE.ShaderMaterial({
      uniforms:{
        positions:{ type: "t", value: null},
        pointSize: { type: "t", value: 40},
        velocity: { type: "t", value: velocityTexture.getTexture()},
        time: { type: "f", value: null},
        colors: { type: "f", value: colorDataTexture.getTexture() },
        alpha: { type: "f", value: this.params.alpha },
        speed: { type: "f", value: this.params.speed }
      },
      vertexShader: renderVertShader,
      fragmentShader: renderFragShader,
      // blending: THREE.AdditiveBlending,
      transparent: true
    })

    this.renderShader = renderShader
    this.particleObj = new MoveParticles(verticalData ,this.renderer, renderShader)
    this.scene.add( this.particleObj.particles )


    this.last = window.performance.now()
    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }


  render(){
    // this.renderer.setClearColor( { color: 0xffffff })
    let now = window.performance.now()
    let delta = (now - this.last) / 1000
    if (delta > 1) delta = 1
    let time = now/1000
    this.last = now


    // Logger.debug('now :',now)
    // Logger.debug('delta :',delta)
    // Logger.debug('time :',time)
    this.updateRenderShader(time)
    this.particleObj.update(time)
    // this.camera.rotation.y += Math.PI/180 * 1
    this.renderer.render(this.scene, this.camera)
  }

  updateRenderShader(time){
    this.renderShader.uniforms.alpha.value = this.params.alpha
    this.renderShader.uniforms.speed.value = this.params.speed
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