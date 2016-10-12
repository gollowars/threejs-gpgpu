import { Top } from './Top'
import RankingNav from './RankingNav'

export default class PcTop extends Top {

  init(){
    this.rankNav = new RankingNav({pc:true})
    this.setupPointAction()

    setTimeout(()=>{
      this.counter()
    },1000)

    this.gnavTracking()
    $('#gnNav a').on('click',(e)=>{
      this.clickSmoothScroll(e)
    })

    $('#gnNav a,.comment-image').on('click',(e)=>{
      this.clickSmoothScroll(e)
    })


  }

  clickSmoothScroll(e){
    e.preventDefault()
    this.smoothScroll($(e.currentTarget).attr("href"))
  }

  onLoadScroll(){
    this.smoothScroll($(location).attr('href'))
  }

  smoothScroll(url){
    let diff = 100
    let speed = 900
    if(url.indexOf("?id=") != -1){
        let id = url.split("?id=")
        let $target = $('#' + id[id.length - 1])
        if($target.length){
            let pos = $target.offset().top - diff
            $("html, body").animate({scrollTop:pos}, speed,'easeInOutQuint')
        }
    }
  }

  // gnav 追従
  gnavTracking(){
    this.offsetTop = $("#gnNav").offset().top
    this.checkTop()
    $(window).on('scroll',()=>{this.checkTop()})
  }
  checkTop(){
    let scrollTop = $(window).scrollTop()
    if(scrollTop - this.offsetTop > 0){
      $("#gnNav").addClass('fixed')
    }else {
      $("#gnNav").removeClass('fixed')
    }
  }

}