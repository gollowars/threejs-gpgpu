import { Common } from './site/Common'
import { Router } from './site/Router'
import { Top } from './site/top/Top'
import Config from './site/Config'
import { About } from './site/about/About'
import { PageMachine } from './site/PageMachine'
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
    this.pageMachine = new PageMachine({
      'top': new Top(),
      'about': new About()
    })

    this.router = new Router({
      "/":()=>{
        this.pageMachine.changePage('top')
      },
      "/about/":()=>{
        this.pageMachine.changePage('about')
      }
    })
  }

  addEvent(){
    $(window).on('pageshow',()=>{
      Logger.debug('pageshow')
      this.commonAction.run()
      this.router.action()

      this.addPjaxEvent()
    })
  }

  addPjaxEvent(){
    // pjax
    let nextPageLink = ''
    if($.support.pjax) {
      $('a[data-pjax]').on('click',(e)=>{
        e.preventDefault()
        nextPageLink = $(e.currentTarget).attr('href')
        $(document).trigger(App.event.pageTranslateStart)
      })

      $(document).on(App.event.pageTranslateReady,()=>{
        $.pjax({
          url: nextPageLink,
          container: '#pageContainer',
          fragment: '#pageContainer'
        })
      })

      $(document).on('pjax:end',()=>{
        $(document).trigger(App.event.pageTranslateEnd)
        this.router.action()
      })

      $(document).on('pjax:timeout', function(e) {
        e.preventDefault()
      })

    }
  }


}

new SiteManager()