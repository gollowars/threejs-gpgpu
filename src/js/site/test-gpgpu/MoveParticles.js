import DataTexture from './DataTexture'
import Particles from './Particles'

export default class MoveParticles extends Particles {

  init(){
    super.init()
    
  }

  update(time){
    this.particles.material.uniforms.positions.value = this.dataTexture.getTexture()
    Logger.debug('time:',time)
    this.particles.material.uniforms.time.value = time
  }
}