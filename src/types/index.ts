export interface Reservation {
  id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'rejected';
  name: string;
  phone: string;
  description: string;
  serviceType: 'equipment' | 'dj' | 'both';
  createdAt?: string;
  updatedAt?: string;
}

export interface TimeSlot {
  id?: string;
  time: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}