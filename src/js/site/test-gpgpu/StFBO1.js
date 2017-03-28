////////////////////////
// Utils
import { getRandomData } from './utils/Utils'
import FBO from './utils/fbo'

////////////////////////
// Shaders
import simuVs from '../../../glsl/basic/simulation_vs.glsl'
import simuFs from '../../../glsl/basic/simulation_fs.glsl'
import renderVs from '../../../glsl/basic/render_vs.glsl'
import renderFs from '../../../glsl/basic/render_fs.glsl'


export default class StFBO1 {
  constructor(){

    this.scene = null
    this.camera = null
    this.renderer = null
    this.startTime = new Date()
    this.animationID = null

    this.init()
  }

  init(){
    Logger.debug("⭐️ StFBO1 INIT")

    let w = $(window).width()
    let h = $(window).height()

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60,w/h, 1,10000 )
    this.camera.position.z = 500

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)


    let width = 256*1
    let height = 256*1

    let data = getRandomData(width,height,256)
    let positions = new THREE.DataTexture(data, width, height, THREE.RGBFormat, THREE.FloatType)
    positions.needsUpdate = true


    let simulationShader = new THREE.ShaderMaterial({
      uniforms: {
        positions: {type:"t", value: positions}
      },
      vertexShader: simuVs,
      fragmentShader: simuFs
    })

    let renderShader = new THREE.ShaderMaterial({
      uniforms: {
        positions:{type:"t",value:null},
        pointSize: {type:"t",value:2}
      },
      vertexShader: renderVs,
      fragmentShader: renderFs,
      transparent: true,
      blending: THREE.AdditiveBlending
    })


    FBO.init(width,height,this.renderer,simulationShader,renderShader)
    this.scene.add(FBO.particles)


    // var geometry = new THREE.BoxGeometry( 50, 50, 50 )
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
    // var cube = new THREE.Mesh( geometry, material )
    // this.scene.add( cube )
    this.camera.position.z = 500

    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }

  onResize(){
    Logger.debug("onResize")
    let w = $(window).width()
    let h = $(window).height()
    this.renderer.setSize(w,h)
    this.camera.aspect = w/h
    this.camera.updateProjectionMatrix()
  }

  update(){
    this.animationID = requestAnimationFrame(()=>{this.update()})
    FBO.update()
    FBO.particles.rotation.x += Math.PI / 180 * .5
    FBO.particles.rotation.y -= Math.PI / 180 * .5

    this.renderer.render( this.scene, this.camera )
  }

  destroy(){
    window.cancelAnimationFrame(this.animationID)
  }
}