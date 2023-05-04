// (Étape 1) Import du DRM mongoose et luxon
var mongoose = require("mongoose");
const { DateTime } = require("luxon");


const champions = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  shortPhrase: { type: String, required: true },
  carateristiques: { type: String, required: true, enum: ["Ability Power", "Attack Damage"] },
  dateApparition: {
    type: Date,
    required: true,
  },
  image: { type: String, required: true },
  lane: { type: Number, required: true, ref: "lane" },

});

// (Étape 3) Création d'une nouvelle propriété virtuelle "id" qui aura la valeur de la propriété "_id"
champions.virtual("id").get(function () {
  return this._id;
});

// (Étape 3) Définition de l'object qui sera retourné lorsque la méthode toJSON est appelée
champions.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// (Étape 4) Export du modèle student
// Les modèles sont responsables de la création et de la lecture des documents à partir de la base de données MongoDB.
module.exports = mongoose.model("champion", champions);
