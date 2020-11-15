import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Photo, PhotoService } from '../services/photo.service';
import { UploadService } from '../services/upload.service';

import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef } from '@angular/fire/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  model: any;
  percentage: any = 0;
  items: any;
  catRef: any;

  constructor(
    public photoService: PhotoService, 
    public actionSheetController: ActionSheetController,
    public afs: AngularFirestore,
    public storage: AngularFireStorage,
    public upload: UploadService
    ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
    console.log("save photos loaded.");
    this.model = await mobilenet.load();
    console.log("model loaded");
    console.log(this.storage.storage)
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      const image = new Image();
      var result = String(reader.result);
      console.log(result)
      image.src = result;
      image.width = 1000;
      image.height = 1000;
      console.log(image);
      this.classifyPhoto(image);


      this.upload.uploadFile(file);
      this.storage.ref('cat.jpg').getDownloadURL().subscribe(url => {this.catRef = url});
		}
    // console.log(file);
  }
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

  /**
   * Use mobilenet pre-trained model to classify image.
   * @param image the Image to classify.
   */
  async classifyPhoto(image: HTMLImageElement) {
    const predictions = await this.model.classify(image);
    console.log('Predictions: ');
    console.log(predictions);
    var resultDisplay1 = document.getElementById("result1");
    var resultDisplay2 = document.getElementById("result2");
    var resultDisplay3 = document.getElementById("result3");
    resultDisplay1.textContent = predictions[0]['className'] + predictions[0]['probability'];
    resultDisplay2.textContent = predictions[1]['className'] + predictions[1]['probability'];
    resultDisplay3.textContent = predictions[2]['className'] + predictions[2]['probability'];
    
  }

  /**
   * Display possible actions when an Image is clicked on.
   * @param photo the Image that is clicked on.
   * @param position the position of the Image.
   */
  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Classify',
        role: 'group',
        icon: 'plus',
        handler: () => {
          const image = new Image();
          image.src = photo.webviewPath;
          this.classifyPhoto(image);
        }
      }, {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Does nothing.
         }
      }]
    });
    await actionSheet.present();
  }
}
