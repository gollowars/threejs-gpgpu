////////////////////////
// Utils
import _ from 'lodash'
import { makeSphere, makeGrand, makeInnerSphere,makeColors } from './utils/MyGeometry'
import { getRandomData, parseMesh } from './utils/Utils'
import Particles from './Particles'
import MoveParticles from './MoveParticles'
import DataTexture from './DataTexture'

////////////////////////
// Models
import humanModel from '../../../models/human3.json'

////////////////////////
// Shaders

import renderVertShader from '../../../glsl/askw/moveParticle/render_vs.glsl'
import renderFragShader from '../../../glsl/askw/moveParticle/render_fs.glsl'

import renderVertShader2 from '../../../glsl/askw/mesh/render_vs.glsl'
import renderFragShader2 from '../../../glsl/askw/mesh/render_fs.glsl'

////////////////////////
// Params
class Params {
  constructor(){
    this.alpha = 0.9
    this.speed = 5.0
    this.mix = 0.0
    this.humanSize = 700.0
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
    this.gui.add(this.params, 'mix', 0.0, 1.0)
    this.gui.add(this.params, 'humanSize', 0, 1000.0)
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
    // this.scene.background = new THREE.Color( 0xffffff )

    // this.scene.background = new THREE.Color( 0xffffff )
    this.camera = new THREE.PerspectiveCamera(60,w/h, 1,1000 )
    this.camera.position.z = 220
    // this.controls = new THREE.OrbitControls(this.camera)
    // this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true})
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)

    // load model
    let loader = new THREE.JSONLoader()
    let model = loader.parse(humanModel)
    Logger.debug(model.geometry)
    let modelVertices = model.geometry.vertices
    let modelDataArray = parseMesh(modelVertices)

    let modelData = new Float32Array( modelDataArray )
    // Logger.debug(modelDataArray[modelDataArray.length])
    Logger.debug(modelDataArray.length)
    let side = Math.sqrt(modelDataArray.length / 3)
    let modelDataTexture = new DataTexture(modelData, this.renderer)
    Logger.debug('modelDataTexture.positions:',modelDataTexture.positions)
    // gpgpu 用意
    // let side = 126/2

    let verticalData = getRandomData(side, side, 500)
    let velocityData = makeInnerSphere(1, side*side)
    let colorData = makeColors(side*side)
    let velocityTexture = new DataTexture(velocityData, this.renderer)
    let colorDataTexture = new DataTexture(colorData, this.renderer)


    let renderShader = new THREE.ShaderMaterial({
      uniforms:{
        positions:{ type: "t", value: null},
        modelPosition:  { type : "t", value: modelDataTexture.getTexture() },
        pointSize: { type: "t", value: 20},
        velocity: { type: "t", value: velocityTexture.getTexture()},
        time: { type: "f", value: null},
        colors: { type: "f", value: colorDataTexture.getTexture() },
        alpha: { type: "f", value: this.params.alpha },
        speed: { type: "f", value: this.params.speed },
        mixAmount: { type: "f", value : this.params.mix },
        humanSize: { type: "f", value : this.params.humanSize },
        nearFar: { type: "v2", value:new THREE.Vector2( 150, 500 ) }
      },
      vertexShader: renderVertShader,
      fragmentShader: renderFragShader,
      // blending: THREE.AdditiveBlending,
      transparent: true
    })

    this.renderShader = renderShader
    this.particleObj = new MoveParticles(verticalData ,this.renderer, this.renderShader)
    this.scene.add( this.particleObj.particles )


    this.last = window.performance.now()
    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()

    $('canvas').on('click',()=>{this.onclickHandler()})
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
    this.particleObj.particles.rotation.y += Math.PI/180* 0.1
    this.particleObj.particles.rotation.z += Math.PI/180* 0.1

    let rotationAmount = 1.0 - this.params.mix
    this.particleObj.particles.rotation.z = (Math.PI/180* time*2.0)*rotationAmount
    this.particleObj.particles.rotation.y = (Math.PI/180* time*2.0)*rotationAmount + (Math.PI/180* 45)

    this.particleObj.update(time)
    // this.camera.rotation.y += Math.PI/180 * 1
    this.renderer.render(this.scene, this.camera)
  }

  onclickHandler(){
    Logger.debug('onclick!')
    Logger.debug(TWEEN)
    let tween = new TWEEN.Tween(this.params)
    .to( { mix: 1.0 }, 1000 )
    .easing( TWEEN.Easing.Quadratic.InOut )
    .onComplete(function(){
      tween.stop()
    })
    .start()
  }

  updateRenderShader(time){
    this.renderShader.uniforms.alpha.value = this.params.alpha
    this.renderShader.uniforms.speed.value = this.params.speed
    this.renderShader.uniforms.mixAmount.value = this.params.mix
    this.renderShader.uniforms.humanSize.value = this.params.humanSize
  }


  update(){
    this.animationID = requestAnimationFrame(()=>{this.update()})
    this.render()
    TWEEN.update()
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
    $(this.renderer.domElement).remove()
    $('.dg.main').remove()
    this.gui = null
    this.params = null
  }
}