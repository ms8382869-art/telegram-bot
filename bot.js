require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

app.post("/webhook", async (req, res) => {

    const message = req.body.message?.text;
    const chatId = req.body.message?.chat?.id;

    if (!message) {
        return res.sendStatus(200);
    }

    let reply = "مش فاهم السؤال";

    // مثال تجريبي
    if (message.includes("سكر")) {

        // هنا هتجيب البيانات من البرنامج
        const stock = 150;

        reply = `كمية السكر الحالية ${stock}`;
    }

    await axios.get(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
            params: {
                chat_id: chatId,
                text: reply
            }
        }
    );

    res.sendStatus(200);

});

app.listen(3000, () => {
    console.log("Bot running on port 3000");
});