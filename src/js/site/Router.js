import Config from "./Config"
import App from "./App"

export class Router {
  constructor(actions) {
    Logger.debug("Router.intialize");
    this.actions = actions
    this.commonAction = null
    this.place = 0
    this.init()
  }

  init(){
    if(App.currentPath.indexOf(Config.devPath) >= 0){
      App.currentPath = App.currentPath.replace(Config.devPath,"")
      App.devFlag = true
    }
    Logger.debug("App.currentPath : ",App.currentPath)
  }

  action(){
    let currentKey = Object.keys(this.actions).filter((k)=> {
      if(App.currentPath == k) return true}
    )[0]

    if(typeof this.commonAction == "function"){
      this.commonAction()
    }

    Logger.debug("Current Action Key is : ",currentKey)
    if(currentKey){
      this.actions[currentKey]()
    }
  }
    
}