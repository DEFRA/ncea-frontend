
const {BlobServiceClient } = require("@azure/storage-blob"); 
const {DefaultAzureCredential } = require("@azure/identity");

const  xlsx =require('xlsx');
  
async  function  readBlob() {
  
  const  accountName  =  "devnceinfst1401";
  
  const containerName  =  "ncea-classifiers";
  
  const  blobName  =  "NCEA T&F Vocab v1.1 2024-04-02.xlsx";
  
  // Create a DefaultAzureCredential instance
  
  const  credential  =  new  DefaultAzureCredential();
  
  const  blobServiceClient  =  new  BlobServiceClient(`https://${accountName}.blob.core.windows.net`,credential);
  
  const  containerClient  =  blobServiceClient.getContainerClient(containerName);
  
  try {
    // Get a reference to a blob
  
  const  blobClient  =  containerClient.getBlobClient(blobName);
  
  // Download blob content as a buffer
  const blobData  =  await  blobClient.downloadToBuffer();

 // Parse Excel file from buffer
  const  workbook  =  xlsx.read(blobData, { type:  'buffer' });
  
  // Access sheets
  const  sheetNames  =  workbook.SheetNames;
  
 console.log('Sheet names:', sheetNames);
  // Access sheet data
  const  firstSheetName  =  sheetNames[0];
  const  sheetData  =  workbook.Sheets[firstSheetName];
  const  sheetJson  =  xlsx.utils.sheet_to_json(sheetData);
  console.log('Sheet data:', sheetJson);
  } catch (error) {
    console.error("Error reading blob:", error);
  }
  }
  readBlob();  