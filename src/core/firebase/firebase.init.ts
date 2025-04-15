import * as admin from 'firebase-admin';
import { FirebaseConfigInterface } from './firebase.config';

export function initFirebase(config: FirebaseConfigInterface) {
  return admin.initializeApp({
    credential: admin.credential.cert(config),
  });
}
