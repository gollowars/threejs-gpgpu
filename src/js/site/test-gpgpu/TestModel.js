////////////////////////
// Utils
import { getRandomData, parseMesh, getSphere, getRandomSphere} from './utils/Utils'
import FBO from './utils/fbo'
import _ from 'lodash'
////////////////////////
// Models
import humanModel from '../../../models/human3.json'


////////////////////////
// Shaders
import dataVs from '../../../glsl/askw/testvtf/data_vs.glsl'
import dataFs from '../../../glsl/askw/testvtf/data_fs.glsl'

import simuVs from '../../../glsl/askw/testvtf/simulation_vs.glsl'
import simuFs from '../../../glsl/askw/testvtf/simulation_fs.glsl'

import renderVs from '../../../glsl/mesh/render_vs.glsl'
import renderFs from '../../../glsl/mesh/render_fs.glsl'

export default class TestModel {
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
    this.camera.position.z = 20
    this.controls = new THREE.OrbitControls(this.camera)
    this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)

    let loader = new THREE.JSONLoader()
    let model = loader.parse(humanModel)
    Logger.debug(model.geometry)
    // let mesh = new THREE.Mesh( model.geometry, new THREE.MeshBasicMaterial({wireframe: true}) )
    // this.scene.add(mesh)

    let vertices = model.geometry.vertices
    let data = parseMesh(vertices)
    Logger.debug(data[data.length-1])
    data = data.map(function(point){return point*10})
    this.originalVertices = vertices
    let size = Math.sqrt( data.length / 3)

    let positions = new THREE.DataTexture(new Float32Array( data ),size,size,THREE.RGBFormat, THREE.FloatType )
    positions.needsUpdate = true

    // let sphereRandVertices = getRandomData( size, size, 256 )
    // let randPositions = new THREE.DataTexture(sphereRandVertices,size, size, THREE.RGBFormat, THREE.FloatType, THREE.DEFAULT_MAPPING, THREE.RepeatWrapping, THREE.RepeatWrapping )
    // randPositions.needsUpdate = true

    let simulationShader = new THREE.ShaderMaterial({
        uniforms: {
            positions: { type: "t", value: positions }
        },
        vertexShader: simuVs,
        fragmentShader: simuFs
    })

    this.simShader = simulationShader

    var renderShader = new THREE.ShaderMaterial( {
        uniforms: {
            positions: { type: "t", value: null },
            pointSize: { type: "f", value: 2 },
            nearFar: { type: "v2", value:new THREE.Vector2( 150, 500 ) }
        },
        vertexShader: renderVs,
        fragmentShader: renderFs,
        transparent: true
    } )


    FBO.init(size,size,this.renderer,simulationShader,renderShader)

    this.scene.add( FBO.particles )

    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }


  render(){
    this.controls.update()

    let current = new Date()
    let diff = current - this.prev
    if(diff > 5){
      this.prev = current
      this.timeCount += 0.01
    }

    this.randomVertics()
    FBO.update()
    // FBO.particles.rotation.y -= Math.PI / 180 * .4


    this.renderer.render(this.scene, this.camera)
  }


  randomVertics(){
    let vertices = this.originalVertices.concat([])
    let data = parseMesh(vertices)
    let maxRand = 1.0
    let scale = this.scale
    let count = this.timeCount

    Logger.debug('maxRand*Math.sin(count):',maxRand*Math.sin(count))
    data = data.map(function(point){return (point*scale) + (Math.random()*maxRand*Math.sin(count))})

    let size = Math.sqrt( data.length / 3)
    let positions = new THREE.DataTexture(new Float32Array( data ),size,size,THREE.RGBFormat, THREE.FloatType)
    positions.needsUpdate = true

    // this.simShader.uniforms.positions.value = positions
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