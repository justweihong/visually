import { Component, Input, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';  
import { Photo } from 'src/app/services/photo.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {
  @Input() photo: Photo;
  filepath: String;
  webviewPath: String;
  predictions: any;

  constructor(public modalCtrl: ModalController) { }

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
}
