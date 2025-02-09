const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

// Middleware pour autoriser les requêtes CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Récupérer toutes les wilayas
app.get("/api/wilaya", (req, res) => {
  db.query("SELECT * FROM form_db.wilaya", (err, results) => {
    if (err) {
      return res.status(500).send("Erreur lors de la récupération des wilayas");
    }
    res.json(results);
  });
});

//Récupérer toutes les moughataas
app.get("/api/moughataa", (req, res) => {
  db.query("SELECT * FROM form_db.moughataa", (err, results) => {
    if (err) {
      return res.status(500).send("Erreur lors de la récupération des moughataas");
    }
    res.json(results);
  });
});
// Récupérer toutes les fonctions
app.get("/api/fonction", (req, res) => {
  db.query("SELECT * FROM form_db.fonction", (err, results) => {
    if (err) {
      return res.status(500).send("Erreur lors de la récupération des fonctions");
    }
    res.json(results);
  });
});

// Récupérer les matières
app.get("/api/matiere", (req, res) => {
  db.query("SELECT * FROM form_db.matiere", (err, results) => {
    if (err) {
      console.error("Erreur récupération matières :", err);
      return res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
    res.json(results);
  });
});
// Route pour récupérer les détails de l'utilisateur par matricule
app.get("/api/utilisateur/:matricule", (req, res) => {
    const { matricule } = req.params;
  
    db.query("SELECT * FROM utilisateurs WHERE matricule = ?", [matricule], (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des détails de l'utilisateur :", err);
        return res.status(500).json({ message: "Erreur serveur lors de la récupération des détails de l'utilisateur" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Aucun utilisateur trouvé avec ce matricule." });
      }
  
      res.status(200).json(results[0]);
    });
  });
  
// Récupérer les moughataas en fonction de la wilaya
app.get("/api/moughataa/:wilayaId", (req, res) => {
  const wilayaId = req.params.wilayaId;
  db.query("SELECT * FROM form_db.moughataa WHERE wilaya_id = ?", [wilayaId], (err, results) => {
    if (err) {
      return res.status(500).send("Erreur lors de la récupération des moughataas");
    }
    res.json(results);
  });
});

// Route pour mettre à jour les informations de l'utilisateur
app.put("/api/utilisateur/:matricule", (req, res) => {
    const { matricule } = req.params;
    const { wilaya_actuel, moughataa_actuel, wilaya_souhaite, moughataa_souhaite } = req.body;
  
    const sql = `
      UPDATE utilisateurs 
      SET wilaya_actuel = ?, moughataa_actuel = ?, wilaya_souhaite = ?, moughataa_souhaite = ?
      WHERE matricule = ?
    `;
  
    db.query(sql, [wilaya_actuel, moughataa_actuel, wilaya_souhaite, moughataa_souhaite, matricule], (err, result) => {
      if (err) {
        console.error("Erreur lors de la mise à jour :", err);
        return res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé pour mise à jour." });
      }
  
      res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
    });
  });

// Insertion avec vérification du matricule
app.post("/api/form", (req, res) => {
  const {
    nom, prenom, matricule, num_tel,
    wilaya_actuel, moughataa_actuel, wilaya_souhaite, moughataa_souhaite,
    fonction_id, matiere_id
  } = req.body;

  const fonctionId = parseInt(fonction_id, 10);
  const matiereId = parseInt(matiere_id, 10);

  // Vérifier si le matricule existe déjà
  db.query("SELECT * FROM utilisateurs WHERE matricule = ?", [matricule], (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification du matricule :", err);
      return res.status(500).json({ message: "Erreur serveur lors de la vérification du matricule" });
    }

    if (results.length > 0) {
      // Matricule déjà existant
      return res.status(409).json({ message: "Le matricule existe déjà" });
    }

    // Si matricule inexistant, insérer l'utilisateur
    const sql = `
      INSERT INTO utilisateurs 
      (nom, prenom, matricule, num_tel, wilaya_actuel, moughataa_actuel, wilaya_souhaite, 
      moughataa_souhaite, fonction_id, matiere_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      nom, prenom, matricule, num_tel,
      wilaya_actuel, moughataa_actuel, wilaya_souhaite,
      moughataa_souhaite, fonctionId, matiereId
    ], (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion :", err);
        return res.status(500).json({ message: "Erreur serveur lors de l'insertion" });
      }
      res.status(201).json({ message: "Utilisateur inséré avec succès" });
    });
  });
});

app.get('/api/utilisateurs/match', (req, res) => {
    const { wilaya_actuel, moughataa_actuel } = req.query;
 
    const sqlQuery = `
      SELECT *
      FROM utilisateurs
      WHERE 
         wilaya_souhaite = ?
        
    `;
  
    db.query(sqlQuery, 
      [wilaya_actuel, wilaya_actuel, moughataa_actuel, moughataa_actuel], 
      (err, results) => {
        if (err) {
          console.error("Erreur lors de la récupération des utilisateurs :", err);
          res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
        } else {
          res.json(results);
        }
      });
  });  


app.post("/api/echange", (req, res) => {
    const { matricule, wilaya_souhaite, moughataa_souhaite } = req.body;
  
    db.query("SELECT * FROM utilisateurs WHERE matricule = ?", [matricule], (err, results) => {
      if (err) {
        console.error("Erreur lors de la vérification du matricule :", err);
        return res.status(500).json({ message: "Erreur serveur lors de la vérification du matricule" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Matricule non trouvé. Veuillez vous inscrire avant de soumettre un échange." });
      }
  
      // Mise à jour des souhaits d'échange
      const sql = `
        UPDATE utilisateurs 
        SET wilaya_souhaite = ?, moughataa_souhaite = ?
        WHERE matricule = ?
      `;
  
      db.query(sql, [wilaya_souhaite, moughataa_souhaite, matricule], (err, result) => {
        if (err) {
          console.error("Erreur lors de la mise à jour de l'échange :", err);
          return res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'échange" });
        }
  
        res.status(200).json({ message: "Échange enregistré avec succès" });
      });
    });
  });
    




// Démarrer le serveur
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
