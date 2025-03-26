import React from "react";
import ceubLogo from "/Logo_Ceub_Negativa_Lilas.png"; 

const Header = () => {
  return (
    <header className="bg-[#450B4D] h-16 flex items-center px-6">
      <img src={ceubLogo} alt="CEUB Logo" className="h-26 w-auto ml-[10vw]" />
      <span className="text-white text-3xl font-semibold">
        Núcleo de Esportes
      </span>
    </header>
  );
};

export default Header;
