import { Page } from '../Page'
import App from '../App'

export class Top extends Page {
  enter(){
    Logger.debug('Top:Enter!!')

    $('#fullpage').fullpage({
      loopTop: true,
      loopBottom: true,
      loopHorizontal: true,
      scrollingSpeed: 700,
      easingcss3: 'cubic-bezier(0.86, 0, 0.07, 1)',
      navigation: true,
      navigationPosition: 'right',
      showActiveTooltip: false
    })


    $(document).trigger(App.event.pageTranslateEnd)
  }

  exit(){
    Logger.debug('Top:Exit!!')
    $.fn.fullpage.destroy('all')
  }

}