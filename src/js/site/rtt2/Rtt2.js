import { Page } from '../Page'
import App from '../App'
import TestRTT2 from '../test-gpgpu/TestRTT2'

export class Rtt2 extends Page {

  enter(){
    Logger.debug('Rtt2:Enter!!')

    this.canvasRender = new TestRTT2()
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('Rtt2:Exit!!')
    this.canvasRender.destroy()
  }
}