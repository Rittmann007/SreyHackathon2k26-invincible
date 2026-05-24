const { Client, Storage, ID } = require('node-appwrite');

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

const uploadFile = async (fileBuffer, fileName, mimeType) => {
  const file = await storage.createFile(
    process.env.APPWRITE_BUCKET_ID,
    ID.unique(),
    new File([fileBuffer], fileName, { type: mimeType })
  );
  return {
    fileId: file.$id,
    url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`,
    name: fileName,
    mimeType: mimeType,
  };
};

const deleteFile = async (fileId) => {
  await storage.deleteFile(process.env.APPWRITE_BUCKET_ID, fileId);
};

module.exports = { uploadFile, deleteFile };