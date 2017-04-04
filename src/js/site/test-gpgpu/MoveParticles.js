import DataTexture from './DataTexture'
import Particles from './Particles'

export default class MoveParticles extends Particles {

  init(){
    super.init()
    this.velocityTexture = new DataTexture(this.data, this.renderer)
    this.particles.material.uniforms.velocity.value = this.velocityTexture.getTexture()
  }

  update(time){
    this.particles.material.uniforms.positions.value = this.dataTexture.getTexture()
    this.particles.material.uniforms.time.value = time
  }
}