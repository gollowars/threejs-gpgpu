import { Common } from './site/Common'
import { Router } from './site/Router'
import { Top } from './site/top/Top'
import Config from './site/Config'
import { About } from './site/about/About'
import { Rtt2 } from './site/rtt2/Rtt2'
import { Vtr } from './site/vtr/Vtr'
import { Human } from './site/human/Human'
import { Colors } from './site/colors/Colors'
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
      'about': new About(),
      'rtt2': new Rtt2(),
      'vtr': new Vtr(),
      'human': new Human(),
      'colors': new Colors()
    })

    this.router = new Router({
      "/":()=>{
        this.pageMachine.changePage('top')
      },
      "/about/":()=>{
        this.pageMachine.changePage('about')
      },
      "/rtt2/":()=>{
        this.pageMachine.changePage('rtt2')
      },
      "/vtr/":()=>{
        this.pageMachine.changePage('vtr')
      },
      "/human/":()=>{
        this.pageMachine.changePage('human')
      },
      "/colors/":()=>{
        this.pageMachine.changePage('colors')
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


      $(document).on(App.event.pageTranslateStart,()=>{
        this.commonAction.pageTranslateStart()
        .done(()=>{
          $(document).trigger(App.event.pageTranslateReady)
        })
      })

      $(document).on(App.event.pageTranslateReady,()=>{
        $.pjax({
          url: nextPageLink,
          container: '#pageContainer',
          fragment: '#pageContainer'
        })
      })

      $(document).on('pjax:end',()=>{
        this.router.action()
      })

      $(document).on('pjax:timeout', function(e) {
        e.preventDefault()
      })

    }
  }


}

new SiteManager()