////////////////////////
// Utils
import _ from 'lodash'
import { makeSphere, makePlane } from './utils/MyGeometry'
////////////////////////
// Models


////////////////////////
// Shaders
import vglsl from '../../../glsl/askw/testvtf/data_vs.glsl'
import fglsl from '../../../glsl/askw/testvtf/data_fs.glsl'


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
    this.camera = new THREE.OrthographicCamera(-1,1,1,-1,1/Math.pow( 2, 53 ),1 )
    this.camera.position.z = 2
    // this.controls = new THREE.OrbitControls(this.camera)
    // this.controls.minDistance = this.controls.maxDistance = this.camera.position.z

    this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
    this.renderer.setSize(w,h)
    $('#pageContainer').append(this.renderer.domElement)

    // vertexshaderからtextureが利用できるかcheck
    let gl = this.renderer.getContext()

    if(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0){
      console.log('cannot use vertex texture image unit')
    }

    let radius = 3
    let size = 256


    let positionArray = makeSphere(radius, size)
    let position = new Float32Array(positionArray)
    let indicesArray = []
    for(let i = 0;i<positionArray.length/3;i++){
      indicesArray.push(i)
    }

    let indices = new Float32Array( indicesArray )
    let bufferGeometry = new THREE.BufferGeometry()
    bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( position, 3 ))
    bufferGeometry.addAttribute( 'vertexIndex', new THREE.BufferAttribute(new Uint16Array(indices), 1))
    bufferGeometry.setIndex( new THREE.BufferAttribute(new Uint16Array(indices), 1))

    // 表示判定
    bufferGeometry.computeBoundingSphere()

    let sideValue = Math.sqrt(size)
    Logger.debug( 'sideValue:',sideValue )

    let simulationShader = new THREE.ShaderMaterial({
      uniforms:{
        side: { type :'f', value: sideValue },
        quality: { type: 'f', value: 1.0 }
      },
      vertexShader: vglsl,
      fragmentShader: fglsl
    })


    this.mesh = new THREE.Points( bufferGeometry, simulationShader)
    Logger.debug(this.mesh.material)

    this.scene.add( this.mesh )


    // let geometry = new THREE.BufferGeometry()
    // geometry.addAttribute('position', new THREE.BufferAttribute(vertices , 3))
    // let material = new THREE.MeshBasicMaterial( { color : 0xff0000 })
    // let mesh = new THREE.Points( geometry, material )
    // this.scene.add( mesh )

    window.addEventListener('resize',()=>{this.onResize()})
    this.onResize()
    this.update()
  }


  render(){
    // this.mesh.rotation.x += Math.PI/180 * 1
    // this.mesh.rotation.y += Math.PI/180 * 1
    // this.mesh.rotation.z += Math.PI/180 * 1

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