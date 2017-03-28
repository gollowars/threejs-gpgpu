////////////////////////
// Utils
import { getRandomData } from './utils/Utils'

////////////////////////
// Shaders
import dataVs from '../../../glsl/askw/testvtf/data_vs.glsl'
import dataFs from '../../../glsl/askw/testvtf/data_fs.glsl'

export default class TestRTT {
  constructor(){

    this.scene = null
    this.camera = null
    this.renderer = null
    this.startTime = new Date()
    this.animationID = null

    this.init()
  }

  init(){
    Logger.debug("==========StRTT INIT")

    this.w = $(window).width()
    this.h = $(window).height()

    let w = this.w
    let h = this.h

    // Base Scene Rendering
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(30,w/h,0.1,10000)
    this.camera.position.z = 50

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)

    this.setupRttTexture()
    this.addRttRenderingMesh()

    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }

  setupRttTexture(){
    this.sceneRtt = new THREE.Scene()
    this.cameraRtt = new THREE.PerspectiveCamera(30,this.w/this.h)
    this.cameraRtt.position.z = 1
    let planeGeoRtt = new THREE.PlaneBufferGeometry(5,5)
    let planeMaterialRtt = new THREE.MeshBasicMaterial({color:0x3344ff})
    let planeRtt = new THREE.Mesh(planeGeoRtt,planeMaterialRtt)

    planeRtt.position.z = -10
    this.sceneRtt.add(planeRtt)


    let geometry = new THREE.BoxBufferGeometry( 1, 1, 1 )
    let material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} )
    this.rttbox = new THREE.Mesh( geometry, material )
    this.rttbox.position.z = -5
    this.sceneRtt.add(this.rttbox)


    this.rtTexture = new THREE.WebGLRenderTarget(256,256,{
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    })
  }

  renderRtt(){
    this.renderer.render(this.sceneRtt,this.cameraRtt,this.rtTexture,true)
    this.rttbox.rotation.z += Math.PI/180 * 1
    this.rttbox.rotation.x += Math.PI/180 * 1
    this.rttbox.rotation.y += Math.PI/180 * 1
  }

  addRttRenderingMesh(){
    let pg = new THREE.PlaneBufferGeometry(this.w/50,this.h/50)
    let pm = new THREE.MeshBasicMaterial({ map: this.rtTexture, side: THREE.DoubleSide })
    this.plane = new THREE.Mesh(pg,pm)
    this.scene.add(this.plane)
  }

  render(){
    this.renderRtt()


    this.plane.rotation.y += Math.PI/180 * - 0.3
    // this.plane.rotation.x += Math.PI*2/360 *  0.4
    // this.plane.rotation.z += Math.PI*2/360 *  0.4

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
    this.cameraRtt.aspect = w/h
    this.cameraRtt.updateProjectionMatrix()
  }

  destroy(){
    window.cancelAnimationFrame(this.animationID)
  }
}