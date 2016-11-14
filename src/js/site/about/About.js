import { Page } from '../Page'
import App from '../App'

export class About extends Page {

  enter(){
    Logger.debug('About:Enter!!')
    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('About:Exit!!')
  }
}