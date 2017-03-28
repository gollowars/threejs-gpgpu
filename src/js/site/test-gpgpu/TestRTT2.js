////////////////////////
// Utils
import { getRandomData } from './utils/Utils'

////////////////////////
// Shaders
import simuVs from '../../../glsl/basic/simulation_vs.glsl'
import simuFs from '../../../glsl/basic/simulation_fs.glsl'

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


    // make rtt scene
    let width = 256
    let height= 256


    this.rttScene = new THREE.Scene()
    this.rttCamera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 )
    var options = {
            minFilter: THREE.NearestFilter,//important as we want to sample square pixels
            magFilter: THREE.NearestFilter,//
            format: THREE.RGBFormat,//could be RGBAFormat
            type:THREE.FloatType//important as we need precise coordinates (not ints)
        }
    this.rtt = new THREE.WebGLRenderTarget( width,height, options)

    let data = this.makeData(width,height,256)
    let positions = new THREE.DataTexture(data, width, height, THREE.RGBFormat, THREE.FloatType)
    positions.needsUpdate = true

    this.simulationMat = new THREE.ShaderMaterial({
      uniforms: {
        positions: {type:"t", value: positions}
      },
      vertexShader: simuVs,
      fragmentShader: simuFs
    })

    let geom = new THREE.BufferGeometry()
    geom.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(
      [-1,-1,0,
        1,-1,0,
        1, 1,0,
       -1,-1,0,
        1, 1,0,
       -1, 1,0 ]), 3 ) )
    geom.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(
      [0,1,
       1,1,
       1,0,
       0,1,
       1,0,
       0,0 ]), 2 ) )
    let textureMesh = new THREE.Mesh( geom, this.simulationMat )
    this.rttScene.add(textureMesh)

    // let sbg = new THREE.BoxBufferGeometry(256,256,256)
    // let sbm = new THREE.MeshBasicMaterial({color:0x00ff00})
    // let box = new THREE.Mesh(sbg,sbm)
    // box.position.z = -10
    // this.rttScene.add(box)

    // main scene
    let pg = new THREE.PlaneBufferGeometry(15,15)
    let pm = new THREE.MeshBasicMaterial({ map: this.rtt})
    let plane = new THREE.Mesh(pg,pm)
    this.scene.add(plane)

    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }

  makeData( width, height, size ){
    var len = width * height * 3
    var data = new Float32Array( len )
    while( len-- )data[len] = ( Math.random() -.5 ) * size 
    return data
  }


  render(){
    this.renderer.render(this.rttScene, this.rttCamera, this.rtt, true)
    this.renderer.render(this.scene, this.camera)
  }

  update(){
    this.animationID = requestAnimationFrame(()=>{this.update()})
    let data = this.makeData(256,256,256)
    let positions = new THREE.DataTexture(data, 256, 256, THREE.RGBFormat, THREE.FloatType)
    positions.needsUpdate = true
    this.simulationMat.uniforms.positions.value = positions

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