import { Component } from '@angular/core'
// import { ViewChild } from '@angular/core'
import { NavController, AlertController } from 'ionic-angular'
import { Camera, MediaPlugin } from 'ionic-native'

import { AdInterface } from './adinterface'

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  public base64Image: string;
  public audioData: string;
  response: AdInterface = {
    url: "http://hdimages.org/wp-content/uploads/2017/03/placeholder-image4.jpg",
    title: "no ad here yet!"
  }

  public media = new MediaPlugin('../Library/NoCloud/recording.wav');

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {}

  slides = [
    {
      title: "Ad Venture",
      description: "Autonomous Ads from Picture to Deployment.",
      image: "assets/imgs/logo.png",
    },
    {
      title: "Step 1: Take a Picture",
      description: "Take a picture of the item you want to advertise",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];

  takePicture () {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData
    }, (err) => {
      // this.showAlert(err.message)
    });
  }

  startRecording () {
    try {
      this.media.startRecord();
    }
    catch (e) {
      this.showAlert('Could not start recording.');
    }
  }

  stopRecording () {
    try {
      this.media.stopRecord();
    }
    catch (e) {
      this.showAlert('Could not start recording.');
    }
  }

  sendToServer () {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this.response = JSON.parse(xhr.response) // Outputs a DOMString by default
      }
    }
    formData.set('imagedata', this.base64Image)
    formData.set('audiodata', null)
    xhr.send(formData)
  }

  private showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }


}