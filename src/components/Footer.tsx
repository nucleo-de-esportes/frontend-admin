import React from 'react';
import Logo from '/Logo_Ceub_Negativa_Lilas.png'; 

const CEUBFooter = () => {
  return (
    <footer className="bg-[#450B4D] h-24 text-white flex justify-between items-end px-4 py-3">
      <div className="text-base ml-[7.5vw]">
        <span>copyright © 2025</span>
      </div>
      <div className="flex flex-col items-end mr-[7.5vw]">
        <img 
          src={Logo} 
          alt="CEUB Logo" 
          className="h-26 object-contain transform translate-x-6 translate-y-6"
        />
        <span className="text-base">Núcleo de Esportes</span>
      </div>
    </footer>
  );
};

export default CEUBFooter;