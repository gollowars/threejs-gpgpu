import { Page } from '../Page'
import App from '../App'
import TestModel from '../test-gpgpu/TestModel'

export class Human extends Page {

  enter(){
    Logger.debug('Human:Enter!!')

    this.canvasRender = new TestModel()
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('Human:Exit!!')
    this.canvasRender.destroy()
  }
}