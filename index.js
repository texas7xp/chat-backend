const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "COLE_AQUI_SUA_URL_DO_RENDER"
});

app.get("/mensagens", async (req, res) => {
  const result = await pool.query("SELECT * FROM mensagens ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/mensagens", async (req, res) => {
  const { nome, texto } = req.body;
  await pool.query("INSERT INTO mensagens (nome, texto) VALUES ($1, $2)", [nome, texto]);
  res.sendStatus(201);
});

app.listen(10000, () => console.log("Servidor rodando na porta 10000"));
