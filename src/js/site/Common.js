import App from './App'

export class Common {
  constructor() {
    Logger.debug("Common.intialize");

    this.addEvent()
  }

  run() {
    Logger.debug("Common.run");
  }

  pageTranslateStart(){
    Logger.debug("Common.pageTranslateStart");


    $(document).trigger(App.event.pageTranslateReady)
  }

  pageEnd(){
    Logger.debug("Common.pageStart");
  }
  addEvent(){
    $(document).on(App.event.pageTranslateStart,this.pageTranslateStart)
  }
}
