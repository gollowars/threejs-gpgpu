class App {

  constructor(){
    this.setCurrentPath()
    this.devFlag = false
    this.event = {}
    this.event.pageTranslateStart = 'PAGE_TRANSLATE_START'
    this.event.pageTranslateReady = 'PAGE_TRANSLATE_READY'
    this.event.pageTranslateEnd = 'PAGE_TRANSLATE_END'
  }
  setCurrentPath(){
    this.currentPath = window.location.pathname.replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((this.place || 0) + 1) + "}$"), "/")
  }
}

export default new App()