import { transitionEnd } from '../Util'

export default class RankingNav {
  constructor(options = false) {
    Logger.debug("RankingNav.intialize");
    this.itemShowDelay = 50
    this.duration = 200
    this.animated = false
    this.firstShowed = false
    this.pc = false
    this.maxListWidth = "100%"
    this.minListWidth = "0%"
    this.noImgSrc = "/images/top/rank-sampleimg.jpg"
    if(options.pc){
      this.maxListWidth = "500px"
      this.minListWidth = "500px"
    }

    this.init()
  }

  init(){
    Logger.debug("RankingNav.run")
    
    $('.ranking-table .img img').each((index,el)=>{
      $(el).on('error',(error)=>{
        $(error.target).attr("src",this.noImgSrc)
      })
    })

    if($('#rankSwitches').length > 0){
      Logger.debug("RankingNav: waiting nav btn click")
      this.addEvent()
    }else{
      Logger.debug("RankingNav: Can not find ranking switches")
    }
  }

  addEvent(){
    $('.ranknav-btn').on('click',(e)=>{this.navBtnClickHandler(e)})
  }

  navBtnClickHandler(e){
    Logger.debug("this.animated : ",this.animated)
    Logger.debug("this.firstShowed : ",this.firstShowed)
    if($(e.currentTarget).hasClass('active') || this.animated == true || this.firstShowed == false){return}
    this.animated = true

    let targetRanking = $(e.currentTarget).attr("data-rank")
    let targetID = targetRanking + "Ranking"
    let $target = $("#" + targetID)
    // Logger.debug("targetRanking : ",targetRanking)

    // switchの色変え
    $(e.currentTarget).siblings('.ranknav-btn.active').removeClass('active')
    $(e.currentTarget).addClass('active')

    // active rankingを変える
    let $hideTarget = $('.ranking-table.active')
    $target.siblings('.ranking-table').removeClass('active')
    $target.addClass('active')

    // title入れ替え
    let duration = this.duration
    $('.ranking-titles').find('.active').transition({
      // width: 0,
      opacity: 0
    },duration,"easeInOutCubic",function(){
      $('.ranking-titles').find('.active').removeClass('active')
      $('.ranking-titles').find("."+targetRanking).transition({
        // width: "750px",
        opacity: 1.0
      },duration,"easeInOutCubic",function(){
        $('.ranking-titles').find("."+targetRanking).addClass('active')  
      })
      
    })

    this.hideItems($hideTarget)
    .then(()=>{
      Logger.debug("hideItems done")
      this.showItem()
      .then(()=>{
        Logger.debug("showItem done")
        this.animated = false
      })
    })

  }

  showItem(){
    Logger.debug("start showItem")
    let d = new $.Deferred
    let delay = this.itemShowDelay
    let duration = this.duration
    let endCnt = 0
    let maxLen = $('#rankList .active li.prepare').length

    if($('#rankList .active li.prepare').length <= 0){
      this.firstShowed = true
      d.resolve()
    }
    $('#rankList .active li.prepare').each((index,el)=>{

      $(el).delay(delay*index).transition({
        width: this.maxListWidth,
        opacity: 1.0
      },duration,"easeInOutCirc",()=>{
        $(el).removeClass('prepare')
        endCnt++
        if(endCnt >= maxLen){
          this.firstShowed = true
          d.resolve()
        }
      })
    })

    return d.promise()
  }

  hideItems($hideTarget){
    let d = new $.Deferred
    let delay = this.itemShowDelay
    let duration = this.duration
    let endCnt = 0
    let maxLen = $hideTarget.find('li').length

    if($hideTarget.find('li').length <= 0){
      d.resolve()
    }
    
    $hideTarget.find('li').each((index,el)=>{
      $(el).delay(delay*index).transition({
        width: this.minListWidth,
        opacity: 0.0
      },duration,"easeInOutCubic",function(){
        $(el).addClass('prepare')
        endCnt++
        if(endCnt >= maxLen){
          d.resolve()
        }
      })
    })

    return d.promise()
  }
}