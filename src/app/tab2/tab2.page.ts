import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Photo, PhotoService } from '../services/photo.service';

import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'
import * as $ from 'jquery';

import { ModalController} from '@ionic/angular'; 
import { ToastController } from '@ionic/angular';  
import { ImageModalComponent } from '../components/image-modal/image-modal.component';

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
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
    ) {}

  /**
   * Loads the gallery and the mobilenet model.
   */
  async ngOnInit() {
    await this.photoService.loadSaved();
    console.log("save photos loaded.");
    await this.loadModel()    
  }

  clickUpload() {
    $("#upload-input").click(); 
  }

  async showModal(photo, number) {  
    const modal = await this.modalCtrl.create({  
      component: ImageModalComponent,
      cssClass: 'image-modal',
      showBackdrop: true,
      backdropDismiss: true,
      animated: true,
      swipeToClose: true,
      componentProps: {
        'photo': photo,
        'number': number,
      }
    });  
    return await modal.present();  
  }  

  async loadModel() {  
    const toast = await this.toastCtrl.create({  
      message: 'loading model...',
      position: 'top',
      translucent: true,   
    });  
    toast.present(); 
    this.model = await mobilenet.load() 
    toast.dismiss();
  }  

  /**
   * Uploads a new photo when a file change is detected.
   */
  async onFileChanged(event) {

    // Display uploading notification
    const toast = await this.toastCtrl.create({  
      message: 'uploading photo...',
      position: 'top',
      translucent: true,   
    });  
    toast.present(); 

    const self = this; // To reference tab component in local scope.
    const file = event.target.files[0];

    // Get image details from file.
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (_event) => {
      const image = new Image();
      image.src = String(reader.result);
      image.onload = async function () { // Loads the original image.width and image.height so that mobilenet model can classify
        
        // Get image upload details
        const filepath = file.name;
        const webviewPath = image.src;
        const predictions = await self.classifyPhoto(image);
        await self.photoService.addNewUploadToGallery(filepath, webviewPath, predictions)
        toast.dismiss();
      };
    }

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
    console.log(predictions);
    return predictions;
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


  /**
   * Refresh the gallery and model with ngOnInit hook.
   */
  async doRefresh(event) {
    await this.ngOnInit();
    event.target.complete();

    // setTimeout(() => {
    //   console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);
  }

}
