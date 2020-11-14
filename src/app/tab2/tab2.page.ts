import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Photo, PhotoService } from '../services/photo.service';

import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  model: any;

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
    console.log("save photos loaded.");
    this.model = await mobilenet.load();
    console.log("model loaded");
  }

  /**
   * Use mobilenet pre-trained model to classify image.
   * @param image the Image to classify.
   */
  async classifyPhoto(image: HTMLImageElement) {
    const predictions = await this.model.classify(image);
    console.log('Predictions: ');
    console.log(predictions);
    
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
