import { Component } from '@angular/core'
// import { ViewChild } from '@angular/core'
import { NavController, AlertController } from 'ionic-angular'
import { Camera, MediaPlugin, File } from 'ionic-native'
declare var window;
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { AdInterface } from './adinterface'

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) all_slides: Slides;
  mediaPlugin: MediaPlugin = null;
  public base64Image: string;
  public audioData: string;
  postUrl: string = 'http://34.227.109.77/annotate' // put URL here
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

  get MediaPlugin(): MediaPlugin {
    if (this.mediaPlugin == null) {
      this.mediaPlugin = new MediaPlugin('recording.wav');
    }

    return this.mediaPlugin;
  }

  slides = [
    {
      title: "Tell us about your product",
      description: "Take a picture and desribe your product in words. We love to hear your <font size ='5' color='red'>voice</font>",
      image: "assets/imgs/slide3.png",
    },
    {
      title: "A smart ad will be created",
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
      quality: 45,
      targetWidth: 1000,
      targetHeight: 1000,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.CAMERA
    }).then((image) => {

      window.resolveLocalFileSystemURL(image, (fileEntry) => {
          fileEntry.file((file) => {
              var reader = new FileReader();
              var self = this
              reader.onloadend = function (e) {
                  var imgBlob = new Blob([this.result], {
                      type: "image/jpeg"
                  });
                  const xhr = new XMLHttpRequest()
                  const formData = new FormData()
                  xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                      console.log(xhr.response)
                      self.response = JSON.parse(xhr.response) // Outputs a DOMString by default
                      self.slideNext()
                    }
                  }
                  formData.append('imagedata', imgBlob)
                  xhr.open('POST', 'http://34.227.109.77/annotate')
                  xhr.send(formData)

              };
              reader.readAsArrayBuffer(file);

          }, function(e) {
              this.showAlert(e.message)
          });
      }, function(e) {
          this.showAlert(e.message)
      });

    }, (err) => {
      this.showAlert(err.message)
    });
  }

  startRecording () {
    try {
      this.MediaPlugin.startRecord();
    }
    catch (e) {
      this.showAlert(e.message)
    }
  }

  stopRecording () {
    try {
      this.MediaPlugin.stopRecord();
    }
    catch (e) {
      this.showAlert('Could not start recording.');
    }
  }

  sendToServer (imageBlob) {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        console.log(xhr.response)
        this.response = JSON.parse(xhr.response) // Outputs a DOMString by default
        this.slideNext() // slide next
      }
    }
    formData.append('imagedata', imageBlob)
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
