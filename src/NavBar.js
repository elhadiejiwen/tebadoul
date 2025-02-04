import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* LOGO */}
        <a href="#" className="text-white text-2xl font-bold">
          Tebadoul
        </a>

        {/* MENU - Desktop */}
        <ul className="hidden md:flex space-x-6 text-white">
          <li>
            <a href="#" className="hover:underline">Accueil</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Echange</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contact</a>
          </li>
        </ul>

        {/* BOUTON LOGIN */}
        <button className="hidden md:block bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-200">
          Connexion
        </button>

        {/* BOUTON BURGER - Mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* MENU - Mobile */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 p-4">
          <ul className="text-white space-y-4">
            <li><a href="#" className="block hover:underline">Accueil</a></li>
            <li><a href="#" className="block hover:underline">Services</a></li>
            <li><a href="#" className="block hover:underline">Contact</a></li>
            <li>
              <button className="w-full bg-white text-blue-600 py-2 rounded shadow hover:bg-gray-200">
                Connexion
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;