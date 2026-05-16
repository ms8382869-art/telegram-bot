require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const SHEET_ID = "1o9A9xTtGcPxcCFTD2C5_zlm4MF9DGiIpdjKB7FAjalU";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

async function searchProduct(query) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "الورقة1!A:D",
  });
  const rows = res.data.values;
  const results = rows.filter(row => row[0] && row[0].toLowerCase().includes(query.toLowerCase()));
  return results;
}

app.post("/webhook", async (req, res) => {
  const message = req.body.message?.text;
  const chatId = req.body.message?.chat?.id;

  if (!message) return res.sendStatus(200);

  try {
    const results = await searchProduct(message);
    let reply = "مش لاقي المنتج ده";

    if (results.length > 0) {
      reply = results.map(r => `📦 ${r[0]}\nالكمية: ${r[1]}\nالمخزن: ${r[2]}\nالتكلفة: ${r[3]}`).join("\n\n");
    }

    await axios.get(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      params: { chat_id: chatId, text: reply }
    });
  } catch (err) {
    console.error(err);
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot running on port 3000"));