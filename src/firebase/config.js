import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyC9sEroW2gAAEBAalNoJK5BMBPEkEHZRws",
  authDomain: "fir-act-3308c.firebaseapp.com",
  projectId: "fir-act-3308c",
  storageBucket: "fir-act-3308c.firebasestorage.app",
  messagingSenderId: "386313658742",
  appId: "1:386313658742:web:1f13cb3a7f81b209c25a57",
  measurementId: "G-RY7W22NCH5"
};

  initializeApp(firebaseConfig);

  const db = getFirestore();
  const auth = getAuth();

  export {db, auth}
  