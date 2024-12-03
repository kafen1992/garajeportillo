import React, { useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import toast from 'react-hot-toast';

interface ReservationFormProps {
  date: string;
  time: string;
  onClose: () => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ date, time, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState<'equipment' | 'dj' | 'both'>('equipment');
  const [submitting, setSubmitting] = useState(false);
  const { createReservation } = useReservations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      await createReservation({
        date,
        time,
        name: name.trim(),
        phone: phone.trim(),
        description: description.trim(),
        serviceType
      });
      toast.success('Reserva enviada correctamente');
      onClose();
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error('Error al enviar la reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Nueva Reserva - {time}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              required
              minLength={2}
              maxLength={50}
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              required
              pattern="[0-9]{9}"
              title="Introduce un número de teléfono válido (9 dígitos)"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio
            </label>
            <select
              id="serviceType"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as 'equipment' | 'dj' | 'both')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              disabled={submitting}
            >
              <option value="equipment">Solo Alquiler de Equipo</option>
              <option value="dj">Solo DJ</option>
              <option value="both">Alquiler + DJ</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Evento
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              rows={4}
              required
              minLength={10}
              maxLength={500}
              placeholder="Describe brevemente el tipo de evento y tus necesidades..."
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};