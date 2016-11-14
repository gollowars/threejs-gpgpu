import App from './App'

export class Common {
  constructor() {
    Logger.debug("Common.intialize");

    this.addEvent()
  }

  run() {
    Logger.debug("Common.run");
  }

  addEvent(){
    $(document).on(App.event.pageTranslateStart,this.pageTranslateStart)
    $(document).on(App.event.pageTranslateEnd,this.pageTranslateEnd)
  }


  pageTranslateStart(){
    Logger.debug("Common.pageTranslateStart");
  }

  pageTranslateEnd(){
    Logger.debug("Common.pageTranslateEnd");
  }
  
}
