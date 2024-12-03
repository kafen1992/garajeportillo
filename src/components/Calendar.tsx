import React, { useState, useEffect } from 'react'; // React ya no muestra advertencias
import { format } from 'date-fns'; // Import optimizado
import { ReservationForm } from './ReservationForm';
import { useReservations } from '../hooks/useReservations';

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { reservations, loading, fetchReservations } = useReservations();

  useEffect(() => {
    fetchReservations(format(selectedDate, 'yyyy-MM-dd'));
  }, [selectedDate]);

  const availableSlots = [
    '10:00', '11:00', '12:00', '13:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleDateChange = (date: string) => {
    setSelectedDate(new Date(date));
    setSelectedTime(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Reservar</h2>
      <div className="mb-6">
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full p-2 border rounded"
          min={format(new Date(), 'yyyy-MM-dd')}
        />
      </div>
      
      {loading ? (
        <div className="text-center">Cargando horarios...</div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {availableSlots.map((time) => {
            const isReserved = reservations.some((r) => r.time === time);
            return (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                disabled={!!isReserved} // Conversión a booleano
                className={`p-2 text-center border rounded ${
                  isReserved 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-50 hover:bg-green-100'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}

      {selectedTime && (
        <ReservationForm
          date={format(selectedDate, 'yyyy-MM-dd')}
          time={selectedTime}
          onClose={() => setSelectedTime(null)}
        />
      )}
    </div>
  );
};
