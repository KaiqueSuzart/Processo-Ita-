import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-[#004080] flex items-center px-6 shadow-lg z-20">
      <h1 className="text-xl font-bold text-white font-inter">InvestApp</h1>
      <nav className="hidden sm:flex space-x-6 ml-8">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-white underline underline-offset-4"
              : "text-white/80 hover:text-white hover:scale-105 transition-transform duration-200"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            isActive
              ? "text-white underline underline-offset-4"
              : "text-white/80 hover:text-white hover:scale-105 transition-transform duration-200"
          }
        >
          Portfólio
        </NavLink>
      </nav>
      <button
        onClick={() => navigate("/")}
        className="ml-auto text-white hover:text-gray-200 flex items-center transition-colors"
      >
        <LogOut className="w-5 h-5 mr-1" />
        <span>Sair</span>
      </button>
    </header>
  );
} 