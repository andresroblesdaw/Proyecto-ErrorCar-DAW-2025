const express = require("express");
const router = express.Router();
const db = require("../firebase");

router.get("/", async (req, res) => {
  const { brand, model } = req.query;

  //Obtener marca
  const brandRef = db.collection("brands").doc(brand);
  const brandSnap = await brandRef.get();

  if (!brandSnap.exists) {
    return res.status(404).json({ error: "Marca no encontrada" });
  }

  const brandData = brandSnap.data();

  //Obtener modelo
  const modelRef = brandRef.collection("models").doc(model);
  const modelSnap = await modelRef.get();

  if (!modelSnap.exists) {
    return res.status(404).json({ error: "Modelo no encontrado" });
  }

  const modelData = modelSnap.data();

  //Obtener generaciones
  const generationsRef = modelRef.collection("generations");
  const generationsSnap = await generationsRef.get();

  const generations = [];

  for (const genDoc of generationsSnap.docs) {
    const genData = genDoc.data();

    //Obtener errores
    const errorsSnap = await genDoc.ref.collection("errors").get();

    const errors = [];
    errorsSnap.forEach((errDoc) => {
      errors.push({
        id: errDoc.id,
        ...errDoc.data(),
      });
    });

    generations.push({
      id: genDoc.id,
      name: genData.name,
      years: genData.years,
      errors,
    });
  }

  //Enviar json
  res.json({
    brandId: brand,
    modelId: model,
    brandName: brandData.name,
    brandLogo: brandData.logo,
    modelName: modelData.name,
    generations,
  });
});

module.exports = router;
