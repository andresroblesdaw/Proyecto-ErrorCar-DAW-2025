const express = require("express");
const router = express.Router();
const db = require("../firebase");

//Ejemplo enpoint modelos de marca /api/models?brand=toyota1
router.get("/", async (req, res) => {
  try {
    const brandId = req.query.brand;
    if (!brandId) {
      return res.status(400).json({ error: "Se requiere la marca" });
    }

    const snapshot = await db
      .collection("brands")
      .doc(brandId)
      .collection("models")
      .get();

    const models = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(models);
  } catch (error) {
    console.error("No se han podido encontrar los modelos", error);
    res.status(500).json({ error: "No se han podido encontrar los modelos" });
  }
});

module.exports = router;
