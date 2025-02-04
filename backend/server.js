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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  app.get("/api/wilaya", (req, res) => {
    db.query("SELECT * FROM form_db.wilaya", (err, results) => {
      if (err) {
        return res.status(500).send("Erreur lors de la récupération des wilayas");
      }
      res.json(results);
    });
  });


  // Route pour récupérer les moughataas en fonction de la wilaya
  app.get('/api/moughataa/:wilayaId', (req, res) => {
    const wilayaId = req.params.wilayaId;
  
    // Requête pour obtenir les moughataas liés à la wilaya
    db.query('SELECT * FROM form_db.moughataa WHERE wilaya_id = ?', [wilayaId], (err, results) => {
      if (err) {
        return res.status(500).send('Erreur lors de la récupération des moughataa');
      }
      res.json(results); // Retourne les résultats au frontend
    });
  });
  
  

app.post("/api/form", (req, res) => {
  const { nom, prenom, matricule,num_tel, wilaya_actuel,moughataa_actuel,wilaya_souhaite,moughataa_souhaite,localite_actuel,localite_souhaite} = req.body;
  const sql = "INSERT INTO utilisateurs (nom, prenom, matricule,num_tel,wilaya_actuel,moughataa_actuel,wilaya_souhaite,moughataa_souhaite,localite_actuel,localite_souhaite) VALUES (?, ?, ?, ?, ?,?,?,?,2,2)";
  db.query(sql, [nom, prenom, matricule, num_tel, wilaya_actuel, moughataa_actuel, wilaya_souhaite, moughataa_souhaite, localite_actuel, localite_souhaite], (err, result) => {
    if (err) throw err;
    res.send("Data inserted");
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});