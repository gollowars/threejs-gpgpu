import { Page } from '../Page'
import App from '../App'
import TestVTR from '../test-gpgpu/TestVTR'

export class Vtr extends Page {

  enter(){
    Logger.debug('Vtr:Enter!!')

    this.canvasRender = new TestVTR()
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('Vtr:Exit!!')
    this.canvasRender.destroy()
  }
}