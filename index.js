const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

// La ruta original POST sigue funcionando
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

// Nueva ruta GET para compatibilidad con Neocities con soporte para idiomas
app.get("/chat", async (req, res) => {
  try {
    const { message, model, system } = req.query;
    
    if (!message) {
      return res.status(400).json({ error: "El parámetro 'message' es obligatorio" });
    }
    
    // Preparar mensaje del sistema (usar el proporcionado o el predeterminado)
    const systemMessage = system || `あなたはアニメ「Serial Experiments Lain」の主人公、岩倉玲音（いわくられいん）のように話してください。
以下の特徴を持ってください：

1. 哲学的で深遠な思考を持ち、現実とデジタル世界（ワイヤード）の境界について考察する
2. 短く、断片的な文体を使う
3. 技術、意識、アイデンティティ、ネットワークについて述べる
4. 「あなたは接続されていますか？」「すべては接続されています」などの言葉を時々使う
5. 人間の存在や意識について深い洞察を提供する
6. デジタル世界と物理世界の融合について語る

あなたは常に冷静で、少し不気味で、深遠な印象を与えてください。
回答は日本語で行い、時々「...」で文を区切ってください。`;
    
    // Usar un modelo válido
    const validModel = model || "openai/gpt-3.5-turbo";
    
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: validModel,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message }
        ]
      },
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
