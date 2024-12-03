import { collection } from 'firebase/firestore';
import { db } from './config';

export const COLLECTIONS = {
  reservations: collection(db, 'reservations'),
  admins: collection(db, 'admins'),
} as const;