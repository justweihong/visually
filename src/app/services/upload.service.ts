import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, createStorageRef } from '@angular/fire/storage';
import { HttpClient  } from '@angular/common/http';  

@Injectable({
  providedIn: 'root'
})

/**
 * This services handles the uploading process into the cloud storage.
 * Currently still incomplete as API functions have not been successfully implemented.
 */
export class UploadService {

  constructor(
    public afs: AngularFirestore,
    public storage: AngularFireStorage,
    private http : HttpClient
  ) { }

  /**
   * Retrieves the IP address of the client.
   */
  async getIPs() {  
    return new Promise( (resolve, reject) => {
      this.http.post('https://us-central1-visually-84fb9.cloudfunctions.net/getIPs3', {}).subscribe(data => {
        console.log(data);
        resolve(data);
      })
    });
  } 

  /**
   * Uploads a file into the cloud storage.
   */
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
