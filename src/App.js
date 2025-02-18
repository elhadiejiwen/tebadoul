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
      <div className="flex items-center justify-center py-4 bg-gray-300">© جميع الحقوق محفوظة تبادل ٢٠٢٥</div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="bg-white p-8 rounded shadow-md w-2/3 text-center">
      <h2 className="text-2xl font-bold mb-4">أهلا بكم في تبادل</h2>
      <p className="text-gray-600">
        مرحبًا بكم في منصتنا المخصصة لمساعدة الأساتذة والمعلمين على التواصل من اجل تبادل أماكن العمل. نحن نسعى لتوفير بيئة سهلة وفعّالة تمكن المعلمين والأساتذة  من التواصل مع زملائهم وتبادل المعلومات حول الفرص المتاحة في مختلف المؤسسات التعليمية.</p>
        من أجل البدء في الإطلاع على من يرغبون في التحويل إلى مكان عملك الحالي ماعليك سوى ملأ استمارة البيانات بالضغط على تسجيل البيانات و بعد ذلك تبدأ عملية البحث
    </div>
  );
}

function ContactPage() {
  return (
    <div className="bg-white p-8 rounded shadow-md w-2/3 text-center">
      <h2 className="text-2xl font-bold mb-4">نرحب بتواصلكم معنا من خلال العناوين التالية</h2>
  
      <div className="text-gray-700 text-lg space-y-3">
        <p>📞 رقم الهاتف :  +222 45 12 34 56</p>
        <p>📧 البريد الإلكتروني : contact@email.com</p>
        <p>💬 واتساب :  +222 25 67 89 10</p>
      </div>
    </div>
  );
}
