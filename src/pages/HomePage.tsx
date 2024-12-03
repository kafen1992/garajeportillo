import React from 'react';
import { ContactInfo } from '../components/ContactInfo';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <img
              src="/images/global-sound-logo.jpg"
              alt="Global Sound Equipment Rental"
              className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Garage Club Portillo</h1>
              <p className="text-gray-600">
                Tu espacio para eventos y música en Portillo. Contamos con las mejores
                instalaciones y equipo de sonido profesional para hacer de tu evento
                algo inolvidable.
              </p>
            </div>
            
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
};