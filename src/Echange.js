import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";

export default function Echange() {
  const [formData, setFormData] = useState({
    matricule: "",
    wilaya_actuel: "",
    wilaya_souhaite: "",
    moughataa_actuel: "",
    moughataa_souhaite: ""
  });
  const [userInfo, setUserInfo] = useState(null);
  const [wilayas, setWilayas] = useState([]);
  const [moughataas, setMoughataas] = useState([]);
  const [moughataasT, setMoughataasT] = useState([]);

  console.log("moughataa existant",moughataas)
  const [moughataaActuel, setMoughataaActuel] = useState([]);
  console.log("moughataa act",moughataaActuel)

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/wilaya")
      .then(response => setWilayas(response.data))
      .catch(error => console.error("Erreur de chargement des wilayas :", error));
  }, []);

  useEffect(() => {
    if (formData.wilaya_souhaite) {
      axios.get(`http://localhost:5000/api/moughataa/${formData.wilaya_souhaite}`)
        .then(response => setMoughataas(response.data))
        .catch(error => console.error("Erreur de chargement des moughataas :", error));
    }
  }, [formData.wilaya_souhaite]);

  useEffect(() => {
    if (formData.wilaya_souhaite) {
      axios.get(`http://localhost:5000/api/moughataa`)
        .then(response => setMoughataasT(response.data))
        .catch(error => console.error("Erreur de chargement des moughataas :", error));
    }
  }, [formData.wilaya_souhaite]);
  useEffect(() => {
    if (formData.wilaya_actuel) {
      axios.get(`http://localhost:5000/api/moughataa/${formData.wilaya_actuel}`)
        .then(response => setMoughataaActuel(response.data))
        .catch(error => console.error("Erreur de chargement des moughataas actuelles :", error));
    }
  }, [formData.wilaya_actuel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearch = () => {
    if (formData.matricule.trim() === "") {
      setErrorMessage("Veuillez entrer un matricule.");
      setUserInfo(null);
      setMatchingUsers([]);
      return;
    }

    setLoading(true);
    axios.get(`http://localhost:5000/api/utilisateur/${formData.matricule}`)
      .then((response) => {
        const user = response.data;
        setUserInfo(user);
        setErrorMessage("");
        setFormData((prevFormData) => ({
          ...prevFormData,
          wilaya_actuel: user.wilaya_actuel || "",
          wilaya_souhaite: user.wilaya_souhaite || "",
          moughataa_actuel: user.moughataa_actuel || "",
          moughataa_souhaite: user.moughataa_souhaite || ""
        }));

        axios.get(`http://localhost:5000/api/utilisateurs/match`, {
          params: {
            wilaya_actuel: user.wilaya_actuel,
            wilaya_souhaite: user.wilaya_souhaite,
            moughataa_actuel: user.moughataa_actuel,
            moughataa_souhaite: user.moughataa_souhaite
          }
        })
        .then((res) => {
          setMatchingUsers(res.data);
          console.log("donnee",res.data)
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des utilisateurs correspondants :", err);
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setErrorMessage("Matricule non trouvé. Veuillez vous inscrire avant de continuer.");
          setUserInfo(null);
          setMatchingUsers([]);
        } else {
          setErrorMessage("Erreur lors de la vérification du matricule.");
        }
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/utilisateur/${formData.matricule}`, formData)
      .then((response) => {
        setSuccessMessage("Informations mises à jour avec succès !");
        setEditMode(false);
        setUserInfo(response.data);

        setTimeout(() => {
          setSuccessMessage("");
        }, 10000);
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour :", error);
        setErrorMessage("Une erreur est survenue lors de la mise à jour.");
      });
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-2/3 text-center">
      <h2 className="text-2xl font-bold mb-4">قم بادخال الرقم الاستدلالي من اجل ربطك بجميع من يرغب بالتحويل الى موقع عملك الحالي</h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <form className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">الرقم الاستدلالي</label>
          <input
            type="text"
            name="matricule"
            value={formData.matricule}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded w-full mt-2 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Rechercher"}
          </button>
        </div>

        {editMode && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">الولاية الحالية</label>
              <select
                name="wilaya_actuel"
                value={formData.wilaya_actuel}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">اختيار الولاية</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.id}>{wilaya.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">المقاطعة الحالية</label>
              <select
                name="moughataa_actuel"
                value={formData.moughataa_actuel}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">اختيار المقاطعة</option>
                {moughataaActuel.map((moughataa) => (
                  <option key={moughataa.id} value={moughataa.id}>{moughataa.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">الولاية المطلوبة</label>
              <select
                name="wilaya_souhaite"
                value={formData.wilaya_souhaite}
                onChange={(e) => {
                  handleChange(e);
                  axios.get(`http://localhost:5000/api/moughataa/${e.target.value}`)
                    .then(response => setMoughataas(response.data));
                }}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">اختيار الولاية</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.id}>{wilaya.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">المقاطعة المطلوبة</label>
              <select
                name="moughataa_souhaite"
                value={formData.moughataa_souhaite}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">اختيار المقاطعة</option>
                {moughataas.map((moughataa) => (
                  <option key={moughataa.id} value={moughataa.id}>{moughataa.nom}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleUpdate}
              className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
            >
              Enregistrer les modifications
            </button>
          </>
        )}
      </form>

      {userInfo && !editMode && (
        <div className="relative bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded mt-4 text-left">
          <h3 className="text-lg font-bold mb-2 flex justify-between items-center">
          معلوماتك الحالية:
            <button
              type="button"
              onClick={handleEdit}
              className="text-gray-600 hover:text-yellow-500"
              title="Modifier les informations"
            >
              <Pencil size={20} />
            </button>
          </h3>
          <p><strong>الرقم الاستدلالي :</strong> {userInfo.matricule}</p>
          <p><strong>الإسم العائلي :</strong> {userInfo.nom}</p>
          <p><strong>الإسم  :</strong> {userInfo.prenom}</p>
          <p><strong>الولاية الحالية :</strong> {wilayas.find(w => w.id === userInfo.wilaya_actuel)?.nom || "Non spécifiée"}</p>
          <p><strong>المقاطعة الحالية :</strong> {moughataaActuel.find(m => m.id === userInfo.moughataa_actuel)?.nom || "Non spécifiée"}</p>
          <p><strong>الولاية المطلوبة :</strong> {wilayas.find(w => w.id === userInfo.wilaya_souhaite)?.nom || "Non spécifiée"}</p>
          <p><strong>المقاطعة المطلوبة :</strong> {moughataas.find(m => m.id === userInfo.moughataa_souhaite)?.nom || "Non spécifiée"}</p>
        </div>
      )}

      {matchingUsers.length > 0 && (
        <div className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded mt-4">
          <h3 className="text-lg font-bold mb-2">لائحة الموظفين الراغبين في التحويل الى موقع عملك :</h3>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">الرقم الاستدلالي </th>
                <th className="px-4 py-2 border">رقم الهاتف</th>
                <th className="px-4 py-2 border">الولاية الحالية</th>
                <th className="px-4 py-2 border">المقاطعة الحالية</th>
                <th className="px-4 py-2 border">الولاية المطلوبة</th>
                <th className="px-4 py-2 border">المقاطعة المطلوبة</th>
              </tr>
            </thead>
            <tbody>
              {matchingUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border">{user.matricule}</td>
                  <td className="px-4 py-2 border">{user.num_tel}</td>
                  <td className="px-4 py-2 border">{wilayas.find(w => w.id === user.wilaya_actuel)?.nom || "Non spécifiée"}</td>
                 
                  <td className="px-4 py-2 border">{moughataasT.find(m => m.id === user.moughataa_actuel)?.nom || "Non spécifiée"}</td>
                  <td className="px-4 py-2 border">{wilayas.find(w => w.id === user.wilaya_souhaite)?.nom || "Non spécifiée"}</td>
                  <td className="px-4 py-2 border">{moughataasT.find(m => m.id === user.moughataa_souhaite)?.nom || "Non spécifiée"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
