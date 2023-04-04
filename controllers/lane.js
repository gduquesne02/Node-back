// Import du modèle student
var Student = require("../models/lane");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const studentValidationRules = () => {
  return [
    body("lane")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Lane must be specified."),
  ];
};

const paramIdValidationRule = () => {
  return [
    param("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

const bodyIdValidationRule = () => {
  return [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

// Méthode de vérification de la conformité de la requête
const checkValidity = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

// Create
exports.create = [
  bodyIdValidationRule(),
  studentValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de student à ajouter
    var student = new Student({
      _id: req.body.id,
      lane: req.body.lane,
    });

    // Ajout de student dans la bdd
    student.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("Lane created successfully !");
    });
  },
];

// Read
exports.getAll = (req, res, next) => {
  Student.find(function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

exports.getById = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Student.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
  },
];

// Update
exports.update = [
  paramIdValidationRule(),
  studentValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de student à modifier
    var student = new Student({
      _id: req.params.id,
      lane: req.body.class,
    });

    Student.findByIdAndUpdate(req.params.id, student, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Student with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("Student updated successfully !");
    });
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Student.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Student with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Student deleted successfully !");
    });
  },
];
