import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseApp = initializeApp({
  apiKey:      "AIzaSyCeeEG-vGfhg5YJn6kzZF7nwwagpml-T6E",
  authDomain:  "evalulock.firebaseapp.com",
  projectId:   "evalulock",
  appId:       "1:77813060401:web:9a24578861410c7b4d5610",
});

export const auth = getAuth(firebaseApp);
export const db   = getFirestore(firebaseApp);

