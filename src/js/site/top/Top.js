import { Page } from '../Page'
import App from '../App'
import StFBO1 from '../test-gpgpu/StFBO1'

export class Top extends Page {
  enter(){
    Logger.debug('Top:Enter!!')

    this.testCanvas = new StFBO1()
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('Top:Exit!!')
    this.testCanvas.destroy()
  }

}