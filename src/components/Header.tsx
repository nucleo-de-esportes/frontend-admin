import ceubLogo from "/Logo_Ceub_Negativa_Lilas.png"; 

const Header = () => {
  return (
    <header className="bg-[#43054E] h-24 justify-center md:justify-start flex items-center md:px-40 w-full">
      <img src={ceubLogo} alt="CEUB Logo" className="h-26 w-auto" />
      <h1 className="text-white md:text-3xl font-semibold">
        Núcleo de Esportes
      </h1>
    </header>
  );
};

export default Header;
