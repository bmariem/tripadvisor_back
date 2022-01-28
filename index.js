require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const API_KEY = process.env.API_KEY;
const DOMAIN = process.env.DOMAIN;
var mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

const app = express();
app.use(formidable());
app.use(cors());

app.post("/form", async (req, res) => {
  console.log("route /form");

  try {
    if (
      req.fields.firstname &&
      req.fields.lastname &&
      req.fields.email &&
      req.fields.text
    ) {
      const data = {
        from: `${req.fields.firstname} ${req.fields.lastname} <me@samples.mailgun.org>`,
        to: process.env.EMAIL,
        subject: `Mail from ${req.fields.email}`,
        text: `${req.fields.text}`,
      };

      await mailgun.messages().send(data, (error, body) => {

        if (error === undefined) {
          res.status(200).json({ message: "Email succefully sent 📤" });
        } else {
          res.status(400).json({ message: error.message });
        }
      });
    } else {
      res.status(400).json({ message: "data missing 😞" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).json("Welcome 👋");
});

app.get("*", (req, res) => {
  res.status(400).json({ message: "route not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started 🚀 ");
});