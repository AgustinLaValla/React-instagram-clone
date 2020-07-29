import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/analytics';
import { firebaseConfig } from './config/config';

// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
firebase.analytics();
export const db = fb.firestore();
export const auth = fb.auth();
export const storage = fb.storage();