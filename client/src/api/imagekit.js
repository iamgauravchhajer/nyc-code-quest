import axios from 'axios';

/**
 * Uploads a file directly to ImageKit from the browser using pre-signed authentication.
 * @param {File} file - The file object to upload
 * @param {string} fileName - The name for the uploaded file
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadToImageKit = async (file, fileName) => {
  // 1. Fetch pre-signed authentication parameters from backend
  const authRes = await axios.get('/api/imagekit/auth', { withCredentials: true });
  const { token, expire, signature, publicKey } = authRes.data.data;

  // 2. Build direct ImageKit upload payload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName);
  formData.append('publicKey', publicKey);
  formData.append('signature', signature);
  formData.append('expire', expire);
  formData.append('token', token);

  // 3. Post payload directly to ImageKit Upload endpoint
  const uploadRes = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  // 4. Return the uploaded file URL
  return uploadRes.data.url;
};
