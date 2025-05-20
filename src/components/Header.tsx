import ceubLogo from "/logo-ceub.png";

const Header = () => {
  return (
    <header className="bg-[#43054E] h-max text-white w-screen px-4 py-3">
      <div className='flex justify-between md:justify-start items-center gap-6 max-w-5xl mx-auto px-2'>
        <img src={ceubLogo} alt="CEUB Logo" className="h-12 w-auto" />
        <h1 className="text-white md:text-3xl font-semibold">
          Núcleo de Esportes
        </h1>
      </div>
    </header>
  );
};

export default Header;
