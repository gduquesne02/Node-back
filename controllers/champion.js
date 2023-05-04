// Import du modèle student
var Student = require("../models/champion");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const studentValidationRules = () => {
    return [   
        body("name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Name must be specified.")
            .isAlphanumeric()
            .withMessage("Name has non-alphanumeric characters."),

        body("shortPhrase")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("ShortPhrase must be specified."),


        body("carateristiques")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("carateristiques must be specified."),

        body("dateApparition", "Invalid date")
            .optional({ checkFalsy: true })
            .isISO8601()
            .toDate(),

        body("lane")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Lane must be specified.")
            .isInt()
            .withMessage("Lane must be a number.")
        
    ]
}

const paramIdValidationRule = () => {
    return [
        param("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

const bodyIdValidationRule = () => {
    return [
        body("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

// Méthode de vérification de la conformité de la requête  
const checkValidity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

// Create
exports.create = [bodyIdValidationRule(), studentValidationRules(), checkValidity, (req, res, next) => {
    
    // Création de la nouvelle instance de student à ajouter 
    var student = new Student({
        _id: req.body.id,
        name: req.body.name,
        shortPhrase: req.body.shortPhrase,
        carateristiques: req.body.carateristiques,
        dateApparition: req.body.dateApparition,
        lane: req.body.lane,
      });

    // Ajout de student dans la bdd 
    student.save(function (err) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(201).json("Student created successfully !");
    });
}];

// Read
exports.getAll = (req, res, next) => {
    Student.find()
    .populate("lane")
    .exec((function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
      })
      );

};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Student.findById(req.params.id)
    .populate("lane")
    .exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
}];


// getChampionsByLane
exports.getChampions = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Student.find({ lane: req.params.id })
        .populate("lane")
        .exec(function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(result);
        });
}];

// Update
exports.update = [paramIdValidationRule(), studentValidationRules(), checkValidity,(req, res, next) => {
    
    // Création de la nouvelle instance de student à modifier 
    var student = new Student({
        _id: req.params.id,
        name: req.body.name,
        shortPhrase: req.body.shortPhrase,
        carateristiques: req.body.carateristiques,
        dateApparition: req.body.dateApparition,
        lane: req.body.lane,
      });

      Student.findByIdAndUpdate(req.params.id, student, function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Student with id "+req.params.id+" is not found !");
        }
        return res.status(201).json("Student updated successfully !");
      });
}];

// Delete
exports.delete = [paramIdValidationRule(), checkValidity,(req, res, next) => {
    Student.findByIdAndRemove(req.params.id).exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Student with id "+req.params.id+" is not found !");
        }
        return res.status(200).json("Student deleted successfully !");
      });
}];