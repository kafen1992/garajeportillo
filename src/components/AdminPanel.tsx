import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, X, Edit2, Check, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useReservations } from '../hooks/useReservations';
import { useTimeSlots } from '../hooks/useTimeSlots';
import type { Reservation, TimeSlot } from '../types';
import toast from 'react-hot-toast';

export const AdminPanel = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { reservations, loading, fetchReservations, updateReservationStatus } = useReservations();
  const { 
    timeSlots, 
    addTimeSlot, 
    removeTimeSlot, 
    updateTimeSlot,
    updateAvailability 
  } = useTimeSlots();
  
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [editingSlot, setEditingSlot] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations(format(selectedDate, 'yyyy-MM-dd'));
  }, [selectedDate]);

  const handleStatusUpdate = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus(id, status);
      await fetchReservations(format(selectedDate, 'yyyy-MM-dd'));
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleAddTimeSlot = async () => {
    try {
      if (!newSlotTime) {
        toast.error('Selecciona una hora válida');
        return;
      }
      await addTimeSlot(newSlotTime);
      setIsAddingSlot(false);
      setNewSlotTime('');
      toast.success('Horario añadido correctamente');
    } catch (error) {
      toast.error('Error al añadir el horario');
    }
  };

  const handleRemoveTimeSlot = async (time: string) => {
    try {
      await removeTimeSlot(time);
      toast.success('Horario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el horario');
    }
  };

  const handleUpdateAvailability = async (time: string, isAvailable: boolean) => {
    try {
      await updateAvailability(time, isAvailable);
      toast.success('Disponibilidad actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la disponibilidad');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Panel de Administración</h2>
      
      <div className="space-y-6">
        {/* Selector de fecha */}
        <div className="flex gap-4 items-center">
          <CalendarIcon size={24} />
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="p-2 border rounded"
          />
        </div>

        {/* Gestión de horarios */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Horarios Disponibles</h3>
            <button
              onClick={() => setIsAddingSlot(true)}
              className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800"
            >
              <Plus size={16} />
              Añadir Horario
            </button>
          </div>

          {isAddingSlot && (
            <div className="flex items-center gap-2 mb-4">
              <input
                type="time"
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={handleAddTimeSlot}
                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setIsAddingSlot(false)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                className="flex items-center justify-between p-2 border rounded"
              >
                {editingSlot === slot.time ? (
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => updateTimeSlot(slot.time, e.target.value)}
                    className="p-1 border rounded"
                  />
                ) : (
                  <span>{slot.time}</span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateAvailability(slot.time, !slot.available)}
                    className={`p-1 rounded ${
                      slot.available ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {slot.available ? <Check size={16} /> : <AlertTriangle size={16} />}
                  </button>
                  <button
                    onClick={() => setEditingSlot(editingSlot === slot.time ? null : slot.time)}
                    className="p-1 text-blue-600 rounded hover:bg-blue-50"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveTimeSlot(slot.time)}
                    className="p-1 text-red-600 rounded hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de reservas */}
        {loading ? (
          <div className="text-center">Cargando reservas...</div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reservas del día</h3>
            {reservations.length === 0 ? (
              <p className="text-center text-gray-500">No hay reservas para este día</p>
            ) : (
              reservations.map((reservation) => (
                <div key={reservation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{reservation.name}</p>
                      <p className="text-sm text-gray-600">{reservation.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{reservation.time}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Tipo de Servicio:</p>
                    <p className="text-sm text-gray-600">
                      {reservation.serviceType === 'equipment' && 'Solo Alquiler de Equipo'}
                      {reservation.serviceType === 'dj' && 'Solo DJ'}
                      {reservation.serviceType === 'both' && 'Alquiler + DJ'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Descripción:</p>
                    <p className="text-sm text-gray-600">{reservation.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                      className={`px-3 py-1 rounded text-sm ${
                        reservation.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 hover:bg-green-50'
                      }`}
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'rejected')}
                      className={`px-3 py-1 rounded text-sm ${
                        reservation.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 hover:bg-red-50'
                      }`}
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};