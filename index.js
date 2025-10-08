import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Substitua pela URL do seu banco no Render
const pool = new Pool({
  connectionString: "postgresql://chat_db_93e6_user:xWGz5hB1P2PJFaZvrcgzzvg1tt3HSAsH@dpg-d3j1vvt6ubrc73a06240-a/chat_db_93e6postgresql://chat_db_93e6_user:xWGz5hB1P2PJFaZvrcgzzvg1tt3HSAsH@dpg-d3j1vvt6ubrc73a06240-a.oregon-postgres.render.com/chat_db_93e6"
});

// 🔸 Criar tabela automaticamente
pool.query(`
  CREATE TABLE IF NOT EXISTS mensagens (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    mensagem TEXT
  )
`);

// 🔹 Rotas CRUD
app.get("/mensagens", async (req, res) => {
  const result = await pool.query("SELECT * FROM mensagens ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/mensagens", async (req, res) => {
  const { nome, mensagem } = req.body;
  await pool.query("INSERT INTO mensagens (nome, mensagem) VALUES ($1, $2)", [nome, mensagem]);
  res.json({ status: "Mensagem salva!" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
