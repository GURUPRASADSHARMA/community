import React from 'react';
import { Users, Building2 } from 'lucide-react';

function Header() {
  return (
    <div className='m-auto h-20 bg-gray-300 flex justify-center items-center rounded shadow-md animate-slideFadeIn'>
      <div className='flex items-center gap-4'>
        <Building2
          size={32}
          className="text-indigo-600 transition-transform duration-300 hover:scale-110"
        />
        <h1 className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
          BUILD<span className="text-zinc-700">community</span>
        </h1>
        <Users
          size={28}
          className="text-pink-500 transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  );
}

export default Header;


