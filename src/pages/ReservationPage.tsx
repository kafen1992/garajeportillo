import React from 'react';
import { Calendar } from '../components/Calendar';

export const ReservationPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Calendar />
        </div>
      </div>
    </div>
  );
};