import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Global sound Portillo</Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-gray-300">Inicio</Link>
          <Link to="/reservas" className="flex items-center gap-2 hover:text-gray-300">
            <Calendar size={20} />
            Reservas
          </Link>
          <Link to="/admin" className="flex items-center gap-2 hover:text-gray-300">
            <User size={20} />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};