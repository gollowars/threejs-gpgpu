import { Common } from './site/Common'
import { Router } from './site/Router'
import { Top } from './site/top/Top'
import Config from './site/Config'
import { About } from './site/about/About'
import App from './site/App'



class SiteManager {
  constructor(){
    this.init()
    this.addEvent()

  }

  init(){
    // Logger
    Logger.useDefaults()

    if(!Config.logOn) {
      Logger.setLevel(Logger.WARN)
      Logger.setLevel(Logger.OFF)
    }

    this.commonAction = new Common()
    this.topAction = new Top()
    this.aboutAction = new About()


    this.router = new Router({
      "/":()=>{
        this.topAction.run()
      },
      "/about/":()=>{
        this.aboutAction.run()
      }
    })
  }

  addEvent(){
    $(window).on('pageshow',()=>{
      Logger.debug('pageshow')
      this.commonAction.run()
      this.router.action()
    })

    // pjax
    var pageLink = ''
    if($.support.pjax) {
      $('a[data-pjax]').on('click',function(e){
        e.preventDefault()
        pageLink = $(e.currentTarget).attr('href')
        $(document).trigger(App.event.pageTranslateStart)
      })

      $(document).on(App.event.pageTranslateReady,function(){
        $.pjax({
          url: pageLink,
          container: '#pageContainer',
          fragment: '#pageContainer'
        })
      })

      $(document).on('pjax:end',()=>{
        $(document).trigger(App.event.pageTranslateEnd)
        this.router.action()
      })
    }

  }
}

new SiteManager()