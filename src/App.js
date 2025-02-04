import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./NavBar";

export default function App() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    num_tel: "",
    matricule: "",
    wilaya_actuel: "",
    moughataa_actuel: "",
    wilaya_souhaite: "",
    moughataa_souhaite: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [wilayas, setWilayas] = useState([]);
  const [moughataasActuel, setMoughataasActuel] = useState([]);
  const [moughataasSouhaite, setMoughataasSouhaite] = useState([]);

  // Charger les wilayas au montage du composant
  useEffect(() => {
    axios.get("http://localhost:5000/api/wilaya")
      .then((response) => setWilayas(response.data))
      .catch((error) => console.error("Erreur chargement wilayas :", error));
  }, []);

  // Gérer le changement de wilaya actuel
  const handleWilayaActuelChange = (e) => {
    const wilayaId = e.target.value;
    setFormData({ ...formData, wilaya_actuel: wilayaId, moughataa_actuel: "" });

    axios.get(`http://localhost:5000/api/moughataa/${wilayaId}`)
      .then((response) => setMoughataasActuel(response.data))
      .catch((error) => console.error("Erreur chargement moughataas :", error));
  };

  // Gérer le changement de wilaya souhaité
  const handleWilayaSouhaiteChange = (e) => {
    const wilayaId = e.target.value;
    setFormData({ ...formData, wilaya_souhaite: wilayaId, moughataa_souhaite: "" });

    axios.get(`http://localhost:5000/api/moughataa/${wilayaId}`)
      .then((response) => setMoughataasSouhaite(response.data))
      .catch((error) => console.error("Erreur chargement moughataas :", error));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/form", formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-2/3 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-center">Formulaire d'inscription</h2>
          {submitted ? (
            <p className="text-green-500">Formulaire soumis avec succès !</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 text-gray-700">Nom</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="p-2 border rounded w-full" required />
              </div>

              <div>
                <label className="mb-2 text-gray-700">Prénom</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="p-2 border rounded w-full" required />
              </div>

              <div>
                <label className="mb-2 text-gray-700">Numéro de téléphone</label>
                <input type="text" name="num_tel" value={formData.num_tel} onChange={handleChange} className="p-2 border rounded w-full" required />
              </div>

              <div>
                <label className="mb-2 text-gray-700">Matricule</label>
                <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} className="p-2 border rounded w-full" required />
              </div>

              {/* Wilaya Actuelle */}
              <div>
                <label className="mb-2 text-gray-700">Wilaya actuelle</label>
                <select name="wilaya_actuel" value={formData.wilaya_actuel} onChange={handleWilayaActuelChange} className="p-2 border rounded w-full" required>
                  <option value="">Sélectionnez une wilaya</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya.id} value={wilaya.id}>{wilaya.nom}</option>
                  ))}
                </select>
              </div>

              {/* Moughataa Actuel */}
              <div>
                <label className="mb-2 text-gray-700">Moughataa actuelle</label>
                <select name="moughataa_actuel" value={formData.moughataa_actuel} onChange={handleChange} className="p-2 border rounded w-full" required disabled={!formData.wilaya_actuel}>
                  <option value="">Sélectionnez un moughataa</option>
                  {moughataasActuel.map((moughataa) => (
                    <option key={moughataa.id} value={moughataa.id}>{moughataa.nom}</option>
                  ))}
                </select>
              </div>

              {/* Wilaya Souhaitée */}
              <div>
                <label className="mb-2 text-gray-700">Wilaya souhaitée</label>
                <select name="wilaya_souhaite" value={formData.wilaya_souhaite} onChange={handleWilayaSouhaiteChange} className="p-2 border rounded w-full" required>
                  <option value="">Sélectionnez une wilaya</option>
                  {wilayas.map((wilaya) => (
                    <option key={wilaya.id} value={wilaya.id}>{wilaya.nom}</option>
                  ))}
                </select>
              </div>

              {/* Moughataa Souhaitée */}
              <div>
                <label className="mb-2 text-gray-700">Moughataa souhaitée</label>
                <select name="moughataa_souhaite" value={formData.moughataa_souhaite} onChange={handleChange} className="p-2 border rounded w-full" required disabled={!formData.wilaya_souhaite}>
                  <option value="">Sélectionnez un moughataa</option>
                  {moughataasSouhaite.map((moughataa) => (
                    <option key={moughataa.id} value={moughataa.id}>{moughataa.nom}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Envoyer</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}