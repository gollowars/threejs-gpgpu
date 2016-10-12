export default class Countup {
  constructor($ele,start,goal) {
    Logger.debug("Countup.intialize");

    this.interval = 50

    this.target = $ele
    this.start = start
    this.goal = goal

    this.init()
  }

  init(){

  }

  countStart(){
    Logger.debug('countStart')

    let promise = new Promise((resolve)=>{
      if(this.goal != 0){
        this.incCount(function(){resolve()})
      }else{
        this.inc0Count(function(){resolve()})
      }
      
    })

    return promise
  }

  incCount(callback){
    if(this.start < this.goal){
      setTimeout(()=>{
        this.start++
        this.target.text(this.start)
        this.incCount(callback)
      },this.interval)
    }else{
      callback()
    }
  }

  inc0Count(callback){
    if(this.start < 9){
      setTimeout(()=>{
        this.start++
        this.target.text(this.start)
        this.inc0Count(callback)
      },this.interval)
    }else{
      this.target.text(0)
      callback()
    }
  }


}