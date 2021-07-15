import { initializeApp } from 'firebase/app';

// Add the Firebase products that you want to use
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCmOaXfaZWZUxWjkFtHk2cuFTeuSdzEs_c',
  authDomain: 'alvarado-dev.firebaseapp.com',
  projectId: 'alvarado-dev',
  storageBucket: 'alvarado-dev.appspot.com',
  messagingSenderId: '619907598179',
  appId: '1:619907598179:web:6a9f098b84824dd9d57556',
  measurementId: 'G-MYEJWNCZVR',
};

export const firebase = initializeApp(firebaseConfig);
