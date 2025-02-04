import React from 'react';
import ReactDOM from 'react-dom/client'; // Remarque : on importe `react-dom/client`
import './index.css';
import Utilisateur from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // Crée le "root" pour le rendu
root.render(<Utilisateur />);

// Si tu veux commencer à mesurer les performances de ton application, passe une fonction
// pour consigner les résultats (par exemple : reportWebVitals(console.log))
// ou envoie-les à un point de terminaison d'analyse. En savoir plus : https://bit.ly/CRA-vitals
reportWebVitals();
