const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require('@azure/storage-blob');
const XLSX = require('xlsx');
const fs = require('fs');

async function readExcelFromBlobStorage() {
  const connectionString = 'https://devnceinfst1401.blob.core.windows.net/';
  const containerName = 'ncea-classifiers';
  const blobName = 'NCEA T&F Vocab v1.1 2024-04-02.xlsx';

  const defaultAzureCredential = new DefaultAzureCredential();
  const blobServiceClient = new BlobServiceClient(connectionString, defaultAzureCredential);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const downloadBlockBlobResponse = await blobClient.download();
  const blobStream = downloadBlockBlobResponse.readableStreamBody;

  // Read Excel file from the stream
  const workbook = XLSX.read(blobStream, { type: 'buffer' });

  // Assuming the first sheet contains the data
  const sheetName = 'ncea-classifiers';
  const worksheet = workbook.Sheets[sheetName];

  // Parse the worksheet into JSON format
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Do something with the data
  console.log(JSON.stringify(data));
}

readExcelFromBlobStorage().catch(console.error);
