import App from './App'
import { Loading } from './loading/Loading'

export class Common {
  constructor() {
    Logger.debug("Common.intialize");

    this.addEvent()
  }

  run() {
    Logger.debug("Common.run");

    this.loading = new Loading()

  }

  addEvent(){
    // $(document).on(App.event.pageTranslateStart,()=>{this.pageTranslateStart()})
    $(document).on(App.event.pageTranslateEnd,()=>{this.pageTranslateEnd()})
  }


  pageTranslateStart(){
    Logger.debug("Common.pageTranslateStart");
    let d = $.Deferred()

    this.loading.showStart()
    .done(()=>{
      d.resolve()
    })

    return d.promise()

  }

  pageTranslateEnd(){
    Logger.debug("Common.pageTranslateEnd");
    let d = $.Deferred()

    this.loading.showEnd()
    .done(()=>{
      d.resolve()
    })

    return d.promise()
  }
  
}
