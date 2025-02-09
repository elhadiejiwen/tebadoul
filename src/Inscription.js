import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InscriptionForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        num_tel: "",
        matricule: "",
        wilaya_actuel: "",
        moughataa_actuel: "",
        fonction_id: "",
        matiere_id: "",
        wilaya_souhaite: "",
        moughataa_souhaite: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [fonctions, setFonctions] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [wilayas, setWilayas] = useState([]);
    const [moughataasActuel, setMoughataasActuel] = useState([]);
    const [moughataasSouhaite, setMoughataasSouhaite] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/wilaya")
            .then((response) => setWilayas(response.data))
            .catch((error) => console.error("Erreur chargement wilayas :", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/api/matiere")
            .then((response) => setMatieres(response.data))
            .catch((error) => console.error("Erreur chargement matières :", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:5000/api/fonction")
            .then((response) => setFonctions(response.data))
            .catch((error) => console.error("Erreur chargement fonctions :", error));
    }, []);

    const handleFonctionChange = (e) => {
        const fonctionId = Number(e.target.value);
        if (isNaN(fonctionId)) {
            console.error("La valeur de fonctionId n'est pas un nombre valide");
            return;
        }

        let updatedFormData = { ...formData, fonction_id: fonctionId };

        if (fonctionId === 2) {
            updatedFormData.matiere_id = 99;
        } else {
            updatedFormData.matiere_id = ""; // Réinitialiser si ce n'est pas fonction_id 2
        }

        setFormData(updatedFormData);
    };

    const handleWilayaActuelChange = (e) => {
        const wilayaId = e.target.value;
        setFormData({ ...formData, wilaya_actuel: wilayaId, moughataa_actuel: "" });

        axios.get(`http://localhost:5000/api/moughataa/${wilayaId}`)
            .then((response) => setMoughataasActuel(response.data))
            .catch((error) => console.error("Erreur chargement moughataas :", error));
    };

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
        setErrorMessage("");

        console.log("Données envoyées : ", formData);

        try {
            const response = await axios.post("http://localhost:5000/api/form", formData);
            console.log("Réponse du serveur : ", response.data);
            setSubmitted(true);
            navigate("/echange");
        } catch (error) {
            console.error("Erreur lors de l'envoi du formulaire", error);

            if (error.response) {
                if (error.response.status === 409) {
                    setErrorMessage("Ce matricule existe déjà. Veuillez en choisir un autre.");
                } else {
                    setErrorMessage("Une erreur est survenue lors de l'envoi du formulaire.");
                }
            } else {
                setErrorMessage("Erreur de connexion au serveur.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-2/3 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-4 text-center">استمارة تسجيل البيانات</h2>
                {submitted ? (
                    <p className="text-green-500">تم التسجيل بنجاح !</p>
                ) : (
                    <>
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 text-gray-700">الإسم العائلي</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="p-2 border rounded w-full" required />
                            </div>

                            <div>
                                <label className="mb-2 text-gray-700">الإسم</label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="p-2 border rounded w-full" required />
                            </div>

                            <div>
                                <label className="mb-2 text-gray-700">رقم الهاتف</label>
                                <input type="text" name="num_tel" value={formData.num_tel} onChange={handleChange} className="p-2 border rounded w-full" required />
                            </div>

                            <div>
                                <label className="mb-2 text-gray-700">الرقم الاستدلالي</label>
                                <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} className="p-2 border rounded w-full" required />
                            </div>

                            <div>
                                <label className="mb-2 text-gray-700">الوظيفة</label>
                                <select name="fonction_id" value={formData.fonction_id} onChange={handleFonctionChange} className="p-2 border rounded w-full" required>
                                    <option value="">اختيار الوظيفة</option>
                                    {fonctions.map((fonction) => (
                                        <option key={fonction.id} value={fonction.id}>{fonction.nom}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.fonction_id === 1 && (
                                <div>
                                    <label className="mb-2 text-gray-700">مادة التدريس</label>
                                    <select name="matiere_id" value={formData.matiere_id} onChange={handleChange} className="p-2 border rounded w-full" required>
                                        <option value=""> اختيار مادة التدريس</option>
                                        {matieres.map((matiere) => (
                                            <option key={matiere.id} value={matiere.id}>{matiere.nom}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="mb-2 text-gray-700">الولاية الحالية</label>
                                <select name="wilaya_actuel" value={formData.wilaya_actuel} onChange={handleWilayaActuelChange} className="p-2 border rounded w-full" required>
                                    <option value="">اختيار الولاية</option>
                                    {wilayas.map((wilaya) => (
                                        <option key={wilaya.id} value={wilaya.id}>{wilaya.nom}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 text-gray-700">المقاطعة الحالية</label>
                                <select name="moughataa_actuel" value={formData.moughataa_actuel} onChange={handleChange} className="p-2 border rounded w-full" required disabled={!formData.wilaya_actuel}>
                                    <option value="">اختيار المقاطعة</option>
                                    {moughataasActuel.map((moughataa) => (
                                        <option key={moughataa.id} value={moughataa.id}>{moughataa.nom}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 text-gray-700">الولاية المطلوبة</label>
                                <select name="wilaya_souhaite" value={formData.wilaya_souhaite} onChange={handleWilayaSouhaiteChange} className="p-2 border rounded w-full" required>
                                    <option value="">اختيار الولاية</option>
                                    {wilayas.map((wilaya) => (
                                        <option key={wilaya.id} value={wilaya.id}>{wilaya.nom}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 text-gray-700">المقاطعة المطلوبة</label>
                                <select name="moughataa_souhaite" value={formData.moughataa_souhaite} onChange={handleChange} className="p-2 border rounded w-full" required disabled={!formData.wilaya_souhaite}>
                                    <option value="">اختيار المقاطعة</option>
                                    {moughataasSouhaite.map((moughataa) => (
                                        <option key={moughataa.id} value={moughataa.id}>{moughataa.nom}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">ارسال</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default InscriptionForm;
