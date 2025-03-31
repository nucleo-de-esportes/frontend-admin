import Logo from '/Logo_Ceub_Negativa_Lilas.png';

const CEUBFooter = () => {
  return (
    <footer className="bg-[#43054E] h-max text-white flex flex-row w-full justify-between items-end px-4 py-3 md:px-40">
      <span className="text-base md:block flex justify-end h-full w-1/3 text-center">
        copyright © 2025
      </span>
      <div className="w-max flex flex-col items-end">
        <img
          src={Logo}
          alt="CEUB Logo"
          className="h-26 object-contain transform"
        />
        <h1 className="text-base">Núcleo de Esportes</h1>
      </div>
    </footer>
  );
};

export default CEUBFooter;