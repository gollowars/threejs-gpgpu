import { Page } from '../Page'
import App from '../App'
import MyVTF from '../test-gpgpu/MyVTF'

export class Top extends Page {
  enter(){
    Logger.debug('Top:Enter!!')

    this.testCanvas = new MyVTF()
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('Top:Exit!!')
    this.testCanvas.destroy()
  }

}