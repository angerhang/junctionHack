import { Component } from '@angular/core'
import { UploadPage } from '../upload/upload'

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root = UploadPage

  constructor() {

  }
}