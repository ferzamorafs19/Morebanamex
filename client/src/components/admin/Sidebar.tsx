import React from 'react';
import { MessageSquare } from 'lucide-react';
import balonxLogo from '../../assets/balonx_logo.png';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isAdmin, isSuperAdmin }) => {
  return (
    <div className="w-60 bg-[#1f1f1f] p-5 h-screen flex flex-col">
      <div className="text-center mb-5">
        <div className="w-16 h-16 mx-auto rounded-full overflow-hidden flex items-center justify-center">
          {/* BALONX Logo */}
          <img src={balonxLogo} alt="Balonx Logo" className="w-full h-full object-cover" />
        </div>
        <h3 className="text-gray-300 text-sm mt-3">Balonx</h3>
        <p className="text-gray-500 text-xs">{isAdmin ? "Admin" : "Usuario"}</p>
      </div>
      <div className="nav flex-1 space-y-2">
        <button 
          onClick={() => onTabChange('current')}
          className={`block w-full text-left ${activeTab === 'current' ? 'bg-[#007bff]' : 'bg-gray-700'} text-white py-2 px-3 rounded hover:bg-opacity-90 transition-all`}
        >
          Accesos
        </button>
        
        <button 
          onClick={() => onTabChange('saved')}
          className={`block w-full text-left ${activeTab === 'saved' ? 'bg-[#007bff]' : 'bg-gray-700'} text-white py-2 px-3 rounded hover:bg-opacity-90 transition-all`}
        >
          Accesos Guardados
        </button>
        
        {isSuperAdmin && (
          <>
            <button 
              onClick={() => onTabChange('registered')}
              className={`block w-full text-left ${activeTab === 'registered' ? 'bg-[#007bff]' : 'bg-gray-700'} text-white py-2 px-3 rounded hover:bg-opacity-90 transition-all`}
            >
              Usuarios
            </button>
            
            <button 
              onClick={() => onTabChange('users')}
              className={`block w-full text-left ${activeTab === 'users' ? 'bg-[#007bff]' : 'bg-gray-700'} text-white py-2 px-3 rounded hover:bg-opacity-90 transition-all`}
            >
              Usuarios Nuevos
            </button>
          </>
        )}
        
        {isAdmin && (
          <button 
            onClick={() => onTabChange('sms')}
            className={`block w-full text-left ${activeTab === 'sms' ? 'bg-[#007bff]' : 'bg-gray-700'} text-white py-2 px-3 rounded hover:bg-opacity-90 transition-all flex items-center`}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            API MSJ
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
