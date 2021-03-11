import { Component, OnInit } from '@angular/core';
import {BlobServiceClient,AnonymousCredential,newPipeline } from '@azure/storage-blob';

import { azureblob } from './../blobconfig';


@Component({
  selector: 'app-blob',
  templateUrl: './blob.component.html',
  styleUrls: ['./blob.component.css']
})
export class BlobComponent implements OnInit {
  showfiles =false;
  readcontent;url;
  currentFile : any =null;
  accountname = azureblob.account;
  key =  azureblob .accountKey;
  container = azureblob .containerName;
  sasToken=azureblob.sasToken;
  list =[];

  constructor() { }

  ngOnInit() {
    this.Fn_getItesm()
  }

  onFileChange(event)
   {
    this.currentFile = event.target.files[0];
    console.log("Selected file is :" ,this.currentFile);

    this.Fn_upload();
   }

   Fn_Showfiles()
   {
     this.showfiles = true;

   }
   async Fn_getItesm()
   {
    const blobServiceClient =new BlobServiceClient(`https://${this.accountname}.blob.core.windows.net?${this.sasToken}`)
    const containerClient =blobServiceClient.getContainerClient(this.container);

    let blobs = containerClient.listBlobsFlat();
    for await (let blob of blobs)
      {
         console.log(this.list.push(`${blob.name}`),`  ${blob .name}`);
      }
    console.log(this.list);
   }

   async Fn_upload()
   {

    const accountName =this.accountname;
    const key=this.key;
    const start = new Date(new Date().getTime());
    const end = new Date(new Date().getTime() + (60 * 60 * 1000));
    const signedpermissions = 'rwdlac';
    const signedservice = 'b';
    const signedresourcetype = 'sco';
    const signedexpiry = end.toISOString().substring(0, end.toISOString().lastIndexOf('.')) + 'Z';
    const signedProtocol = 'https';
    const signedversion = '2018-03-28';

  const StringToSign =
      accountName+ '\n' +
      signedpermissions + '\n' +
      signedservice + '\n' +
      signedresourcetype + '\n' +
       '\n' +
      signedexpiry + '\n' +
       '\n' +
      signedProtocol + '\n' +
signedversion + '\n';
  const crypto =require('crypto')
   const sig = crypto.createHmac('sha256', Buffer.from(key, 'base64')).update(StringToSign, 'utf8').digest('base64');
  const sasToken =`sv=${(signedversion)}&ss=${(signedservice)}&srt=${(signedresourcetype)}&sp=${(signedpermissions)}&se=${encodeURIComponent(signedexpiry)}&spr=${(signedProtocol)}&sig=${encodeURIComponent(sig)}`;
      console.log(sasToken,start,end );


                 const blobServiceClient =new BlobServiceClient(`https://${this.accountname}.blob.core.windows.net?${sasToken}`)
                 const containerClient =blobServiceClient.getContainerClient(this.container)
                if(!containerClient.exists()){
                console.log("the container does not exit")
                await containerClient.create()

                }
                const client = containerClient.getBlockBlobClient(this.currentFile.name)
               const response = await client.uploadBrowserData(this.currentFile,{
                      blockSize: 4 * 1024 * 1024, // 4MB block size
                      concurrency: 20, // 20 concurrency
                      onProgress: (ev) => console.log(ev),
                      blobHTTPHeaders :{blobContentType:this.currentFile.type}
                      })
        console.log(response._response.status)


        this.list.push(this.currentFile.name)



     }
     onItemClick( index: number)
     {
       this.readcontent = `${this.list[index]}`;
       this.url = ` https://${this.accountname}.blob.core.windows.net/${this.container}/${this.readcontent}`
       window.open(this.url);

     }


}
