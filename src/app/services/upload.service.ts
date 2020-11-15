import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef } from '@angular/fire/storage';
import { HttpClient  } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    public afs: AngularFirestore,
    public storage: AngularFireStorage,
    private http : HttpClient
  ) { }

  async getIPAddress() {  
    return new Promise( (resolve, reject) => {
      this.http.get("http://api.ipify.org/?format=json").subscribe((res:any) => {
        resolve(res.ip);
      });
    });  
  } 

  async uploadFile(file: File) {

    // Upload file into FireStorage.
    const fileName = file.name;
    const filePath = `${fileName}`;
    await this.storage.upload(filePath, file);

    // Upload file into Firestore
    const ipAddress = "192.168.1.1";
    const fileData = { url: filePath };
    this.afs.doc(`images/${ipAddress}`).set(fileData, {merge: true}); 
  }
}
