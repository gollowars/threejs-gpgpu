import App from './App'

export class PageMachine {
  constructor(pages){
    Logger.debug('PageMachine.init')

    this.pages = pages
    this.currentPage = null
    this.init()
  }

  init(){
    Logger.debug('PageMachine.init')
  }

  changePage(pageName){
    if(this.currentPage != null){
      this.currentPage.exit()
    }

    if(this.pages.hasOwnProperty(pageName)){
      this.currentPage = this.pages[pageName]
      this.currentPage.enter()
    }else{
      throw new Error('That page is not registered')
    }
  }

}

