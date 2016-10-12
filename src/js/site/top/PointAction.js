let objCnt = 0

export default class PointAction {
  constructor(options){

    if($(options.element) <= 0){
      throw Error("target cannot find out")
    }

    if(typeof options.action != "function"){
      throw Error("action must be function")
    }

    this.target = $(options.element)
    this.action = options.action
    this.offsetTop = this.target.offset().top
    this.diff = (options.diff) ? options.diff : 0
    this.uniqueID = "object_"+ objCnt
    this.eventName = "scroll"+"."+this.uniqueID
    this.loop = (options.loop) ? options.loop : false
    this.init()
  }

  init(){
    $(window).on(this.eventName,(e)=>{this.checkActionHandler(e)})

    this.checkActionHandler()
  }

  checkActionHandler(){
    let windowH = $(window).height()
    let scroll = $(window).scrollTop()

    let current = scroll + windowH
    if(current > this.offsetTop+this.diff){
      this.action()
      if(this.loop == false){
        this.destroy()
      }
    }
  }

  destroy(){
    $(window).off(this.eventName)
  }
}