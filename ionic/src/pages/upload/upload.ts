import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { Camera } from 'ionic-native'

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {
  public base64Image: string;
  constructor(public navCtrl: NavController) {

  }

  takePicture(){
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData
    }, (err) => {
        console.log(err)
    });
  }

  sendToServer() {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.set('imagedata', this.base64Image)
    xhr.send(formData)
  }
}
