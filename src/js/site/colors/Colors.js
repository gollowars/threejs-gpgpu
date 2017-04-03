import { Page } from '../Page'
import App from '../App'
import TestParticleTexture from '../test-gpgpu/TestParticleTexture'

export class Colors extends Page {

  enter(){
    Logger.debug('Color:Enter!!')

    this.canvasRender = new TestParticleTexture()
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('Color:Exit!!')
    this.canvasRender.destroy()
  }
}