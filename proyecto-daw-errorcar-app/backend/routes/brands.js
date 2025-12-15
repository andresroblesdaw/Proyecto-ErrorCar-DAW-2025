const express = require("express");
const router = express.Router();
const db = require("../firebase");

//Ejemplo endpoint marca /api/brands
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("brands").get();

    const brands = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(brands);
  } catch (error) {
    console.error("No se han podido encontrar las marcas", error);
    res.status(500).json({ error: "No se han podido encontrar las marcas" });
  }
});

module.exports = router;
