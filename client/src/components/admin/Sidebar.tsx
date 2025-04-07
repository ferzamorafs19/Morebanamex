import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-60 bg-[#1f1f1f] p-5 h-screen flex flex-col">
      <div className="text-center mb-5">
        <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
          {/* BALONX Logo */}
          <span className="text-white text-2xl font-bold">Bx</span>
        </div>
        <h3 className="text-gray-300 text-sm mt-3">Jefthe Zout</h3>
        <p className="text-gray-500 text-xs">Normal</p>
      </div>
      <div className="nav flex-1">
        <a 
          href="#" 
          className="block bg-[#007bff] text-white py-2 px-3 rounded mb-2 hover:bg-opacity-90 transition-all"
        >
          Accesos
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
