import { Page } from '../Page'
import App from '../App'
import TestRTT from '../test-gpgpu/TestRTT'

export class About extends Page {

  enter(){
    Logger.debug('About:Enter!!')

    this.canvasRender = new TestRTT()
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('About:Exit!!')
    this.canvasRender.destroy()
  }
}