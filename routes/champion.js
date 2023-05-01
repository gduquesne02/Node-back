// (Étape 1) Import de express
var express = require('express');

// (Étape 1) Définition du router
var router = express.Router();

// Import du Contrôleur student
var champion_router = require("../controllers/champion");

// (Étape 2) Ajout de la route qui permet d'ajouter un étudiant
router.post("/", champion_router.create);

// (Étape 2) Ajout de la route qui permet d'afficher tous les étudiants
router.get("/", champion_router.getAll);

// (Étape 2) Ajout de la route qui permet d'afficher un seul étudiant grâce à son identifant
router.get("/:id", champion_router.getById);

router.get('/lane/:id', champion_router.getChampions);

// (Étape 2) Ajout de la route qui permet de modifier un seul étudiant grâce à son identifant
router.put("/:id", champion_router.update);

// (Étape 2) Ajout de la route qui permet de supprimer un seul étudiant grâce à son identifant
router.delete("/:id", champion_router.delete);

// (Étape 1) Export du router
module.exports = router;