// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';
const firebaseConfig = {
  apiKey: 'AIzaSyAc5xs5fCPaIbkuABLzGxm0f5u0jdJ7eqY',
  authDomain: 'instagram-clone-f241a.firebaseapp.com',
  databaseURL: 'https://instagram-clone.firebaseio.com',
  projectId: 'instagram-clone-f241a',
  storageBucket: 'instagram-clone-f241a.appspot.com',
  messagingSenderId: '930678156242',
  appId: '1:930678156242:web:b89d15dce27b090bb2760b',
  measurementId: 'G-RVV52RF0G5',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
