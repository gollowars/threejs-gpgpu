////////////////////////
// Utils
import { getRandomData, parseMesh, getSphere, getRandomSphere} from './utils/Utils'
import FBO from './utils/fbo'

////////////////////////
// Shaders
import dataVs from '../../../glsl/askw/testvtf/data_vs.glsl'
import dataFs from '../../../glsl/askw/testvtf/data_fs.glsl'

import simuVs from '../../../glsl/morph/simulation_vs.glsl'
import simuFs from '../../../glsl/morph/simulation_fs.glsl'

import renderVs from '../../../glsl/morph/render_vs.glsl'
import renderFs from '../../../glsl/morph/render_fs.glsl'

export default class TestVTR {
  constructor(){

    this.scene = null
    this.camera = null
    this.renderer = null
    this.startTime = new Date()
    this.animationID = null

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
    this.camera.position.z = 500
    this.controls = new THREE.OrbitControls(this.camera)
    this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)

    let width  = 256*3
    let height = 256*3
    // let gl = this.renderer.getContext()

    // FROM Mesh
    // let sphereGeometry = new THREE.SphereGeometry( 20, 64, 64 )
    // let sphereVertices = parseMeshsphereGeometry.vertices
    // let data = parseMesh(sphereVertices)
    // let size = Math.sqrt( data.length / 3)
    // let positions = new THREE.DataTexture(data,size,size,THREE.RGBFormat, THREE.FloatType)

    // Make Sphere Vertices
    let sphereVertices = getSphere(width*height,128*2.0)
    let positions = new THREE.DataTexture(sphereVertices,width, height, THREE.RGBFormat, THREE.FloatType, THREE.DEFAULT_MAPPING, THREE.RepeatWrapping, THREE.RepeatWrapping )
    positions.needsUpdate = true


    let sphereRandVertices = getRandomData( width, height, 256 )
    let randPositions = new THREE.DataTexture(sphereRandVertices,width, height, THREE.RGBFormat, THREE.FloatType, THREE.DEFAULT_MAPPING, THREE.RepeatWrapping, THREE.RepeatWrapping )
    randPositions.needsUpdate = true

    let simulationShader = new THREE.ShaderMaterial({
      uniforms:{
        textureA: { type: "t", value: positions },
        textureB: { type: "t", value: randPositions },
        timer: { type: "f", value: 0.5}
      },
      vertexShader: simuVs,
      fragmentShader: simuFs
    })

    this.simShader = simulationShader

    var renderShader = new THREE.ShaderMaterial( {
        uniforms: {
            positions: { type: "t", value: null },
            pointSize: { type: "f", value: 1 },
            nearFar: { type: "v2", value:new THREE.Vector2( 150, 500 ) }
        },
        vertexShader: renderVs,
        fragmentShader: renderFs,
        transparent: true
    })

    FBO.init(width,height,this.renderer,simulationShader,renderShader)
    this.scene.add( FBO.particles )

    // let g = new THREE.SphereBufferGeometry(1,15,15)
    // let m = new THREE.MeshBasicMaterial({color:0x00ff00})
    // let s = new THREE.Mesh(g,m)
    // this.scene.add(s)

    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }


  render(){
    this.controls.update()

    FBO.update()

    let current = new Date()
    let diff = current - this.prev
    if(diff > 5){
      this.prev = current
      this.timeCount += 0.02
    }

    this.simShader.uniforms.timer.value = Math.abs(Math.sin(this.timeCount))
    FBO.particles.rotation.y -= Math.PI / 180 * .4
    FBO.particles.rotation.x += Math.PI / 180 * .4
    FBO.particles.rotation.z -= Math.PI / 180 * .4

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