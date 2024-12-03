import type { Reservation } from '../../types';

export const REQUIRED_INDEXES = [
  {
    collectionId: 'reservations',
    fields: [
      { fieldPath: 'date', order: 'ASCENDING' },
      { fieldPath: 'time', order: 'ASCENDING' }
    ]
  },
  {
    collectionId: 'reservations',
    fields: [
      { fieldPath: 'date', order: 'ASCENDING' },
      { fieldPath: 'time', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' }
    ]
  }
] as const;