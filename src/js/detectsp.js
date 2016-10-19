import config from './site/Config'

if(config.ALLOCATION_DEBUG){
  if(platform.os.family.indexOf('iOS') == -1 && platform.os.family.indexOf('Android') == -1 ){window.location.href = "/"}  
}
