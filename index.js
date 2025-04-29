const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    // Asegurarnos de que estamos usando un modelo válido
    const requestBody = { ...req.body };
    
    // Si no hay modelo especificado o si es "lain-protocol", usar uno válido
    if (!requestBody.model || requestBody.model === "lain-protocol") {
      requestBody.model = "openai/gpt-3.5-turbo";
    }
    
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      requestBody,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al conectar con OpenRouter" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
