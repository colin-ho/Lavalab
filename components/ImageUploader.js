import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import {deleteObject } from "firebase/storage";
import { Button } from '@chakra-ui/button';
import Resizer from "react-image-file-resizer";

const resizeFile = (file) => new Promise(resolve => {
  Resizer.imageFileResizer(file, 600, 600, 'JPEG', 100, 0,
  uri => {
    resolve(uri);
  }, 'blob' );
});
// Uploads images to Firebase Storage
export default function ImageUploader({setPhotoUrl}) {
  const [uploading, setUploading] = useState(false);
  const [lastRef,setLastRef] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const extension = Array.from(e.target.files)[0].type.split('/')[1];
    const file = await resizeFile(Array.from(e.target.files)[0]);
    if(lastRef){
      await deleteObject(lastRef);
    }

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setLastRef(ref);
    setUploading(true);
    console.log(file)
    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setPhotoUrl(url);
          setUploading(false);
        });
    });
  };

  return (
    <Button as="label" cursor="pointer" isLoading={uploading}>
      {!uploading ? "Upload an Image":null}
        {!uploading && (
          <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
        )}
    </Button>
    
  );
}