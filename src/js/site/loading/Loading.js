import { TweenMax, Expo } from 'gsap'

export class Loading {
  constructor() {
    this.ease = 'easeInOutQuint'
    this.speed = 800
    this.tweenSpeed = this.speed/1000

    this.targetTween = null
    this.containerTween = null

    this.init()
  }

  init(){
    Logger.debug('loading::init')
    this.createElement()
  }

  createElement(){
    //contents 
    this.container = $('#pageContainer')
    .css({
      'width':'0%'
    })

    // loading
    this.target = $('#loading')


    this.containerTween = TweenMax.to(
      this.container,
      this.tweenSpeed,
      {
          width:"100%",
          ease:Expo.easeInOut,
          onComplete:()=>{
          }
      }).pause()

    this.targetTween = TweenMax.to(
      this.target,
      this.tweenSpeed,
      {
          width:"0%",
          ease:Expo.easeInOut,
          onComplete:()=>{
          }
      }).pause()

    $('body').append(this.target)
  }

  showStart(){
    let d = $.Deferred()
    this.containerTween.reverse()
    this.targetTween.reverse()
    setTimeout(()=>{
      d.resolve()
    },this.speed)
    return d.promise()
  }

  showEnd(){
    let d = $.Deferred()
    this.containerTween.restart()
    this.targetTween.restart()
    setTimeout(()=>{
      d.resolve()
    },this.speed)
    return d.promise()
  }
}