import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ImageModalComponent } from './image-modal.component';
import { Routes, RouterModule } from '@angular/router';  

const routes: Routes = [  
  {  
    path: 'tabs/tab2',  
    component: ImageModalComponent  
  }  
];  

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule,
    RouterModule.forChild(routes)  
  ],
  declarations: [ImageModalComponent],
  exports: [ImageModalComponent]
})
export class ImageModalModule { }
