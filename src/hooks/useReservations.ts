import { useState, useCallback } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { reservationService, ReservationError } from '../services/reservationService';
import type { Reservation } from '../types';
import toast from 'react-hot-toast';

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useFirebase();

  const fetchReservations = useCallback(async (date: string) => {
    try {
      setLoading(true);
      const data = await reservationService.fetchByDate(date);
      // Si no es admin, solo mostrar las reservas confirmadas
      const filteredData = isAdmin ? data : data.filter(r => r.status === 'confirmed');
      setReservations(filteredData);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      if (error instanceof ReservationError) {
        toast.error(error.message);
      } else {
        toast.error('Error al cargar las reservas');
      }
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'status'>) => {
    try {
      const id = await reservationService.create(reservationData);
      toast.success('Reserva enviada correctamente. Pendiente de confirmación.');
      await fetchReservations(reservationData.date);
      return id;
    } catch (error) {
      if (error instanceof ReservationError) {
        toast.error(error.message);
      } else {
        toast.error('Error al crear la reserva');
      }
      throw error;
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    if (!isAdmin) {
      toast.error('No tienes permisos para realizar esta acción');
      return;
    }
    
    try {
      await reservationService.updateStatus(id, status);
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      if (error instanceof ReservationError) {
        toast.error(error.message);
      } else {
        toast.error('Error al actualizar el estado');
      }
      throw error;
    }
  };

  return {
    reservations,
    loading,
    fetchReservations,
    createReservation,
    updateReservationStatus
  };
};