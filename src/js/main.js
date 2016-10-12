import { Common } from './site/Common'
import { Router } from './site/Router'
import { Top } from './site/top/Top'
import Config from './site/Config'

// Logger
Logger.useDefaults()

if(!Config.logOn) {
  Logger.setLevel(Logger.WARN)
  Logger.setLevel(Logger.OFF)
}

let router = new Router({
  "/":function(){
    new Top()
  }
})

let commonAction = new Common()
router.commonAction = function(){
  commonAction.run()
}

$(window).on('pageshow',function(){
   router.action()
})
