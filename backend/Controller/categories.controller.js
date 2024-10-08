const { validationResult } = require("express-validator");
const Categories = require("../Model/categorie.model");

const getAllcategorie = async (req, res) => {
  const { limit = 5, page = 1 } = req.query;
  const skip = (page - 1) * limit;
  const categoriesArray = await Categories.find().limit(limit).skip(skip);
  const categoriesCount = await Categories.countDocuments();
  res.json({ data: categoriesArray, categoriesCount });
};

const getCategorie = async (req, res) => {
  const categorie = await Categories.findById(req.params.categorieId);
  if (!categorie) {
    return res.status(404).json({ msg: "categorie not found" });
  }
  res.json(categorie);
};

const addCategorie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
  const newCategorie = new Categories(req.body);
  await newCategorie.save();
  res.status(201).json(newCategorie);
};

const updateCategorie = async (req, res) => {
  const categorieId = req.params.categorieId;

  const updateCategorie = await Categories.updateOne(
    { _id: categorieId },
    { $set: { ...req.body } }
  );

  res.status(200).json(updateCategorie);
};

const deleteCategorie = async (req, res) => {
  const dele = await Categories.deleteOne({ _id: req.params.categorieId });
  res.status(200).json({ success: true, msg: dele });
};

module.exports = {
  getAllcategorie,
  getCategorie,
  addCategorie,
  updateCategorie,
  deleteCategorie,
};
