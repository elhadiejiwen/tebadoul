import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./NavBar";
import Inscription from "./Inscription";
import Echange from "./Echange";  // Import du composant Echange

export default function App() {
  return (
    <Router>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
 
          
          <Route path="/form" element={<Inscription />} />
          <Route path="/echange" element={<Echange />} /> {/* Ajout de la route */}
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="bg-white p-8 rounded shadow-md w-2/3 text-center">
      <h2 className="text-2xl font-bold mb-4">أهلا بكم في تبادل</h2>
      <p className="text-gray-600">إضغط على "تسجيل البيانات" لتستفيد من خدماتنا</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="bg-white p-8 rounded shadow-md w-2/3 text-center">
      <h2 className="text-2xl font-bold mb-4">نرحب بتواصل معنا من خلال العناوين التالية </h2>
      <p className="text-gray-600">رقم الهاتف, الايميل ... الخ</p>
    </div>
  );
}
