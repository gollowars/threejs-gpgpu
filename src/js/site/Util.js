export let transitionEnd = ['webkitTransitionEnd','oTransitionEnd','otransitionend','transitionend'].join(' ')

export function animationPromise($target){
  let promise = new Promise(function(resolve){
    $target.removeClass('prepare')
    $target.on(transitionEnd,function(){
      resolve()
    })
  })
  return promise
}

export function getUrlVars(url)
{
    let vars = [], max = 0, hash = "", array = "";

    if(url.indexOf("?") < 0){return false}

    hash  = url.split("?")[1].split('&')
    max = hash.length

    for (let i = 0; i < max; i++) {
        array = hash[i].split('=')
        vars[array[0]] = array[1]
    }
    return vars;
}