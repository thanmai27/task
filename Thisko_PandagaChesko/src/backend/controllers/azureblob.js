const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
var multipart  = require('parse-multipart');
const express = require('express');
var router = express.Router()



// Enter your storage account name and shared key
const account = "deploymentsthanmai";
const accountKey = "fLfGmx8pf0NP+HWxuYiOa0d5enDEs+aCUT1Y0aAhcBBjTebzqviiWbcMUK9zqkq1zX3bYBbXPQN+yZuMySW+Fw==";
const containerName = "thanmaicontainer";

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`, sharedKeyCredential);


// Create a container
async function main() {


    try
    {
      const containerClient = blobServiceClient.getContainerClient(containerName);

        const createContainerResponse = await containerClient.create();
        console.log(`Created container ${containerName} successfully`, createContainerResponse.requestId);

        fn_ListContainer();
  }
    catch(error)
    {
      console.log(error.message);
      fn_ListContainer();

      const containerClient = blobServiceClient.getContainerClient(containerName);

      const content = "this is demo file of azure blobstrage222!";
      const blobName = 'demo2'  + '.txt';
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
      console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
      fn_ListBlobs();


    }
  }



// list the container
async function fn_ListContainer()
{
  let i = 1;
         let containers = blobServiceClient.listContainers();
         for await (const container of containers) {
           console.log(`Container ${i++}: ${container.name}`);


       }
}

async function fn_ListBlobs()
{
  const containerClient = blobServiceClient.getContainerClient(containerName);

  let i = 1;
  let blobs = containerClient.listBlobsFlat();
  for await (const blob of blobs) {
    console.log(`Blob ${i++}: ${blob.name}`);
  }
}

async function fn_DownloadBlobs()
{



  const blobName= "demo.txt"
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = (
    await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
  ).toString();
  console.log("Downloaded blob content:", downloaded);
}

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}
 main()
  //fn_DownloadBlobs();







































































  router.post('/', (req,res)=>
{



//   var bodyBuffer = new Buffer.from(req.body);
//   var boundary = multipart.getBoundary(req.headers['content-Type']);
//   var parts =multipart.Parse(bodyBuffer,boundary);

//   const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
// const blobServiceClient = new BlobServiceClient(
//   `https://${account}.blob.core.windows.net`, sharedKeyCredential);

//   const containerClient = blobServiceClient.getContainerClient(containerName);
//   const blobname = parts[0].filename;
//   const blockblogclient = containerClient.getBlockBlobClient( blobname);
//   const uploadBlobresponse = blockblogclient.upload(parts[0].data,parts[0].datalength);
//   data.res = {body:{name:parts[0].filename,type:parts[0].type,data:parts[0].datalength}};
//   data.done()

//   res.send(data);
})
module.exports = router;
