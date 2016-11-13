import VideoBoxer from 'videoBoxer'

export class Top {
  constructor() {
    Logger.debug("Top.intialize");

    this.init()
  }
  init(){
    
  }

  run(){
    Logger.debug("Top.run");

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

  }
}