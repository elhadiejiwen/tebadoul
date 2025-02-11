import { useState } from "react";
import { Link } from "react-router-dom";  // Importation de Link

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-white text-2xl font-bold">
          Tebadoul
        </Link>

        {/* MENU - Desktop */}
        <ul className="hidden md:flex space-x-6 text-white justify-center flex-1">
          <li>
            <Link to="/f" className="hover:underline">اتصل بنا</Link>
          </li>
          <li>
            <Link to="/echange" className="hover:underline">بحث</Link>
          </li>
          <li>
            <Link to="/form" className="hover:underline">تسجيل البيانات</Link>
          </li>
          <li>
            <Link to="/" className="hover:underline">الصڢحة الرئيسية</Link>
          </li>
        </ul>

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
            <li><Link to="/" className="block hover:underline">الصڢحة الرئيسية</Link></li>
            <li><Link to="/echange" className="block hover:underline">بحث</Link></li>
            <li><Link to="/form" className="block hover:underline">اتصل بنا</Link></li>
            <li><Link to="/Inscription" className="block hover:underline">تسجيل البيانات</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;