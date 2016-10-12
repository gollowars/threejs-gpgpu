import Countup from './Countup'
import PointAction from './PointAction'
import RankingNav from './RankingNav'
import { animationPromise } from '../Util'


export class Top {
  constructor() {
    Logger.debug("Top.intialize");
    this.delay = 300
    this.itemShowDelay = 210
    this.rankNav = null

    this.commaCnt = 3

    this.init()
  }

  init(){
    this.introAnim()
    this.rankNav = new RankingNav()
    this.setupPointAction()
  }

  introAnim(){
    if(Modernizr.cssfilters){
      animationPromise($('#mainBg'))
      .then(()=>{
        animationPromise($('#headTitle'))
        animationPromise($('#infoBlock'))
        .then(()=>{
          this.counter()
        })
      })
    }else{
      $('#mainBg').removeClass('prepare')
      $('#headTitle').removeClass('prepare')
      $('#infoBlock').removeClass('prepare')
      this.counter()
    }
    
  }

  counter(){
    let mileageValue = $('#mileageValue').data('mileage')
    let strMileage = String(mileageValue)
    let countupArray = new Array()

    for(let i in strMileage){
      let targets = $('#mileageValue').find('span')
      let $target = targets.eq(targets.length-1-i)
      let targetNum = parseInt(strMileage[strMileage.length-1-i])
      countupArray.push(new Countup($target,0,targetNum))
    }

    let commaCnt = this.commaCnt
    countupArray.map((countupObj,index)=>{
      setTimeout(function(){

        if(index % commaCnt == 0 && index != 0){
          countupObj.target.after("<span class='number'>,</span>")  
        }

        countupObj.target.removeClass('grayout')
        countupObj.countStart()
      },index*this.delay)
    })
  }

  setupPointAction(){
    if($("#distanceRank").length > 0){
      this.pointAction = new PointAction({
        element: "#distanceRank",
        action: ()=>{this.rankNav.showItem()},
        diff: 300,
        loop: false
      })
    }
    
  }

}