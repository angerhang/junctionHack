import { Component } from '@angular/core'
// import { ViewChild } from '@angular/core'
import { NavController, AlertController } from 'ionic-angular'
import { Camera, MediaPlugin } from 'ionic-native'
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { AdInterface } from './adinterface'

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) all_slides: Slides;
  
  public base64Image: string;
  public audioData: string;
  postUrl: string = '' // put URL here
  response: AdInterface = {
    url: "http://hdimages.org/wp-content/uploads/2017/03/placeholder-image4.jpg",
    title: "no ad here yet!"
  }

  public media = new MediaPlugin('../Library/NoCloud/recording.wav');

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {}

  slideNext() {
    let currentIndex = this.all_slides.getActiveIndex();
    this.all_slides.slideTo(currentIndex + 1, 500);
  }

  goToFirstSlide() {
    this.all_slides.slideTo(0, 500);    
  }

  slides = [
    {
      title: "Tell us about your product",
      description: "Take a picture and desribe your product in words. We love to hear your <font size ='5' color='red'>voice</font>",
      image: "assets/imgs/slide3.png",
    },
    {
      title: "An smart ad will created",
      description: "Our artificial intelligence platform will use computer vision and voice recognition to suggest the best ad for you based on  <font size ='5' color='blue'>thousands </font> of products on the web",
      image: "assets/imgs/slide2.png",
    },
    {
      title: "Finally preview and share!",
      description: "Finally preview and publish your custom ad within  <font size ='5'>one click </font> :D",
      image: "assets/imgs/ad.png",
    },
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
      this.showAlert(err.message)
    });
  }

  startRecording () {
    try {
      this.media.startRecord();
    }
    catch (e) {
      this.showAlert(e.message)
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
    xhr.open('POST', this.postUrl)
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