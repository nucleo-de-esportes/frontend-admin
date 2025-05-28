import Logo from '/logo-ceub.png';

const CEUBFooter = () => {
  return (
    <footer className="bg-[#43054E] h-max text-white w-screen px-4 py-3">
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