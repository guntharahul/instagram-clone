import React, { useState } from 'react';
import { Button, Input } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

const ImageUpload = (props) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    //upload the image
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    // we have to listen to the change as the image upload does not take place immediately
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //progress Bar Function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //handle Error
        console.log(error);
        alert(error.message);
      },
      () => {
        //Complete Function and get Image URL
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //   post image inside database
            db.collection('posts').add({
              caption: caption,
              imageUri: url,
              username: props.username,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            //reset state
            setProgress(0);
            setImage(null);
            setCaption('');
          });
      }
    );
  };

  return (
    <div className='imageUpload__post'>
      <progress
        className='imageUpload__progress'
        value={progress}
        max='100'
      ></progress>
      <Input
        type='text'
        value={caption}
        placeholder='Enter Post Caption ...'
        onChange={(event) => setCaption(event.target.value)}
      ></Input>
      <Input type='file' onChange={handleChange}></Input>
      <Button variant='contained' color='primary' onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
