import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController} from '@ionic/angular';  
import { Photo, PhotoService } from 'src/app/services/photo.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {
  @Input() photo: Photo;
  @Input() number: any;
  filepath: String;
  webviewPath: String;
  predictions: any;

  constructor(
    public photoService: PhotoService,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    ) { }

  ngOnInit() {

    // Defensive layers against empty and null values
    this.filepath = (this.photo.filepath) ? this.photo.filepath : "nil";
    this.webviewPath = (this.photo.webviewPath) ? this.photo.webviewPath : "nil";
    this.predictions = (this.photo.predictions) ? this.photo.predictions : {};
    this.setProbColor();
  }

  setProbColor() {
    for (let i = 0; i < 3; i++) {
      if (this.predictions[i]['probability'] < 0.25) {
        $("#prob-" + (i+1)).css("background-color", "#d78088");
      } else if (this.predictions[i]['probability'] < 0.5) {
        $("#prob-" + (i+1)).css("background-color", "#e1cd41");
      } else if (this.predictions[i]['probability'] < 0.75) {
        $("#prob-" + (i+1)).css("background-color", "#cee744");
      } else {
        $("#prob-" + (i+1)).css("background-color", "#a4f14e");
      }
    }
    
  }

  /**
   * Convert probability ratio to percentage.
   */
  getPercentage(probability) {
    const percentageValue = (probability*100).toFixed(2);
    return percentageValue + "%";
  }
  
  /**
   * Dismiss modal.
   */
  dismiss() {  
    this.modalCtrl.dismiss();  
  }  

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
          this.dismiss();
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
