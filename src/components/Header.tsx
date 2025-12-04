import { useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ceubLogo from "/logo-ceub.png";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { user } = useAuth();

  // Rotas nas quais o menu deve ser ocultado
  const hiddenMenuRoutes = ["/", "/user/cadastro"];

  const shouldHideMenu = hiddenMenuRoutes.includes(location.pathname);

  const navLinks = [
    { name: "Turmas", path: "/turmas", allowedRoles: ["admin", "aluno"] },
    { name: "Nova Turma", path: "/cadastro/turma", allowedRoles: ["admin", "aluno"] },
  ];

  return (
    <header className="bg-[linear-gradient(to_right,_#9A238B_51%,_#340C2F_100%)] text-white w-full px-4 py-3">
      <div className="flex justify-between items-center max-w-5xl mx-auto px-2">
        <div className="flex items-center gap-4">
          <Link to="/turmas" className="hover:opacity-80 transition">
            <img src={ceubLogo} alt="CEUB Logo" className="h-12 w-auto" />
          </Link>
          <h1 className="text-white text-xl md:text-2xl font-semibold">
            Núcleo de Esportes
          </h1>
        </div>

        {!shouldHideMenu && (
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}

        {!shouldHideMenu && (
          <nav className="hidden md:flex gap-6 items-center ml-auto">
            {navLinks
              .filter(link => user && link.allowedRoles.includes(user.user_type))
              .map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-300 font-bold transition underline"
                      : "hover:text-yellow-200 transition hover:underline"
                  }
                >
                  {link.name}
                </NavLink>
              ))}
          </nav>
        )}
      </div>

      {!shouldHideMenu && isOpen && (
        <nav className="md:hidden mt-4 px-4 flex flex-col gap-4">
          {navLinks
            .filter(link => user && link.allowedRoles.includes(user.user_type))
            .map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 font-semibold underline"
                    : "hover:text-yellow-200 transition"
                }
              >
                {link.name}
              </NavLink>
            ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
