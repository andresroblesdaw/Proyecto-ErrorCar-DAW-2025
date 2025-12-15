const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({ ok: false, error: "Mensaje vacío" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en coches. Respondes de forma clara y sencilla sobre marcas, modelos, averías, fiabilidad y mantenimiento, la respuesta debe de ser de un párrafo solamente.",
        },
        {
          role: "user",
          content: mensaje,
        },
      ],
    });

    res.json({
      ok: true,
      respuesta: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error comunicándose con la IA",
    });
  }
});

module.exports = router;
