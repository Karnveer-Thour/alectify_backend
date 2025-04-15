import { ConfigType, registerAs } from '@nestjs/config';

export interface FirebaseConfigInterface {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

export const FIREBASE_CONFIG = 'FIREBASE_CONFIG';

export const FirebaseConfig = registerAs<FirebaseConfigInterface>(
  FIREBASE_CONFIG,
  () => {
    const {
      env: { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL },
    } = process;

    return {
      projectId: FIREBASE_PROJECT_ID,
      privateKey: FIREBASE_PRIVATE_KEY,
      clientEmail: FIREBASE_CLIENT_EMAIL,
    };
  },
);

export type FirebaseConfigType = ConfigType<typeof FirebaseConfig>;
