import { Page } from '../Page'

export class About extends Page {

  setup(){
  }

  enter(){
    Logger.debug('About:Enter!!')
  }

  exit(){
    Logger.debug('About:Exit!!')
  }
}