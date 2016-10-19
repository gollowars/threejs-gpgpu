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
    let movieArray = ['/videos/sample.mp4','/videos/sample.ogv','/videos/sample.webm']
    let options = {
      movieSize: {
        width: 582,
        height: 360
      },
      thumb: '/videos/sample.png',
      autoplay: false
    }

    $('.grid-item').each(function(index, el) {
      new VideoBoxer($(el),movieArray,options)
    });
    this.videoBoxer = new VideoBoxer($('#movieArea'),movieArray,options)

  }
}