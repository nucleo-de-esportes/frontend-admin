import Logo from '/logo-ceub.png';

const CEUBFooter = () => {
  return (
    <footer className="bg-[linear-gradient(to_right,_#9A238B_51%,_#340C2F_100%)] h-max text-white w-full px-4 py-3">
      <div className='max-w-5xl flex justify-between mx-auto px-2'>
        <span className="md:block flex justify-end h-full w-max text-center text-[.8rem] md:text-base">
          copyright © 2025
        </span>
        <div className="w-max flex flex-col items-end">
          <img
            src={Logo}
            alt="CEUB Logo"
            className="h-12 object-contain transform"
          />
          <h1 className="text-base">Núcleo de Esportes</h1>
        </div>
      </div>
    </footer>
  );
};

export default CEUBFooter;