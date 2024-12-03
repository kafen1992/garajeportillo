import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';

export const ContactInfo = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Contacto</h2>
      <div className="space-y-4">
        <a
          href="https://www.instagram.com/globalsoundportillo?igsh=cnAycDZoajU2ZXAz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-pink-600 hover:text-pink-700"
        >
          <Instagram size={24} />
          <span>@globalsoundportillo</span>
        </a>
        
        <a
          href="https://wa.me/34636177308"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-green-600 hover:text-green-700"
        >
          <Phone size={24} />
          <span>+34 636 177 308</span>
        </a>
        
        <a
          href="mailto:garajeclubportillo@gmail.com"
          className="flex items-center gap-3 text-blue-600 hover:text-blue-700"
        >
          <Mail size={24} />
          <span>garajeclubportillo@gmail.com</span>
        </a>
      </div>
    </div>
  );
};