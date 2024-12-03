import { query, where, getDocs, addDoc, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { COLLECTIONS } from '../lib/firebase/collections';
import type { Reservation } from '../types';

export class ReservationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ReservationError';
  }
}

export const reservationService = {
  async fetchByDate(date: string): Promise<Reservation[]> {
    try {
      // Primero intentamos con el índice compuesto
      const q = query(
        COLLECTIONS.reservations,
        where('date', '==', date),
        orderBy('time', 'asc')
      );
      
      try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Reservation));
      } catch (indexError: any) {
        // Si falla por índice, hacemos una consulta más simple
        if (indexError.code === 'failed-precondition') {
          const simpleQuery = query(
            COLLECTIONS.reservations,
            where('date', '==', date)
          );
          const snapshot = await getDocs(simpleQuery);
          const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Reservation));
          
          // Ordenamos manualmente
          return results.sort((a, b) => a.time.localeCompare(b.time));
        }
        throw indexError;
      }
    } catch (error: any) {
      console.error('Fetch error:', error);
      if (error.code === 'permission-denied') {
        throw new ReservationError('No tienes permisos para ver las reservas', 'permission-denied');
      }
      throw new ReservationError('Error al obtener las reservas', 'fetch-error');
    }
  },

  async create(data: Omit<Reservation, 'id' | 'status'>): Promise<string> {
    try {
      // Validaciones
      if (!data.name?.trim()) throw new ReservationError('El nombre es obligatorio', 'invalid-name');
      if (!data.phone?.trim()) throw new ReservationError('El teléfono es obligatorio', 'invalid-phone');
      if (!data.description?.trim()) throw new ReservationError('La descripción es obligatoria', 'invalid-description');

      // Verificar disponibilidad con consulta simple
      const isUnavailable = await this.checkAvailability(data.date, data.time);
      if (isUnavailable) {
        throw new ReservationError('Este horario ya está reservado', 'time-unavailable');
      }

      // Crear reserva
      const reservationData = {
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        name: data.name.trim(),
        phone: data.phone.trim(),
        description: data.description.trim()
      };

      const docRef = await addDoc(COLLECTIONS.reservations, reservationData);
      return docRef.id;
    } catch (error: any) {
      console.error('Create error:', error);
      if (error instanceof ReservationError) throw error;
      if (error.code === 'permission-denied') {
        throw new ReservationError('No tienes permisos para crear reservas', 'permission-denied');
      }
      throw new ReservationError('Error al crear la reserva', 'create-error');
    }
  },

  async updateStatus(id: string, status: Reservation['status']): Promise<void> {
    try {
      const reservationRef = doc(db, 'reservations', id);
      await updateDoc(reservationRef, {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Update error:', error);
      if (error.code === 'permission-denied') {
        throw new ReservationError('No tienes permisos para actualizar reservas', 'permission-denied');
      }
      throw new ReservationError('Error al actualizar el estado', 'update-error');
    }
  },

  async checkAvailability(date: string, time: string): Promise<boolean> {
    try {
      // Usamos una consulta simple sin orderBy
      const q = query(
        COLLECTIONS.reservations,
        where('date', '==', date),
        where('time', '==', time),
        where('status', '==', 'confirmed'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Availability check error:', error);
      return false; // En caso de error, asumimos que está disponible
    }
  }
};