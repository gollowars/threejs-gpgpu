class App {
  constructor(){
    this.currentPath = window.location.pathname.replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((this.place || 0) + 1) + "}$"), "/")
    this.devFlag = false
  }
}

export default new App()