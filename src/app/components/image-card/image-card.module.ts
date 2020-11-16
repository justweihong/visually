import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ImageCardComponent } from './image-card.component';


@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule
  ],
  declarations: [ImageCardComponent],
  exports: [ImageCardComponent]
})
export class ImageCardModule { }
