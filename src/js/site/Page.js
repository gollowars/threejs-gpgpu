import App from './App'

let UNIQUE_ID = 0

export class Page {
  constructor(){
    this.id = UNIQUE_ID
    UNIQUE_ID++
  }

  enter(){
    this.prepare()
    .done(()=>{
      $(document).trigger(App.event.pageTranslateEnd)
    })
  }

  prepare(){
    let d = $.Deferred()
    d.resolve()
    return d.promise()
  }
  exit(){
  }

}

