import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Conexão com seu banco PostgreSQL no Render
const pool = new Pool({
  connectionString:
    "postgresql://chat_db_93e6_user:xWGz5hB1P2PJFaZvrcgzzvg1tt3HSAsH@dpg-d3j1vvt6ubrc73a06240-a.oregon-postgres.render.com/chat_db_93e6",
  ssl: { rejectUnauthorized: false },
});

// 🔹 Cria tabela automaticamente (se não existir)
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100),
        mensagem TEXT
      );
    `);
    console.log("✅ Banco de dados conectado e tabela pronta!");
  } catch (err) {
    console.error("Erro ao inicializar o banco:", err);
  }
}
initDB();

// 🔹 Rota para listar mensagens
app.get("/mensagens", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mensagens ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar mensagens" });
  }
});

// 🔹 Rota para adicionar nova mensagem
app.post("/mensagens", async (req, res) => {
  const { nome, mensagem } = req.body;
  if (!nome || !mensagem) {
    return res.status(400).json({ erro: "Nome e mensagem são obrigatórios!" });
  }

  try {
    await pool.query(
      "INSERT INTO mensagens (nome, mensagem) VALUES ($1, $2)",
      [nome, mensagem]
    );
    res.json({ status: "Mensagem salva com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao salvar mensagem" });
  }
});

// 🔹 Rota para excluir mensagem pelo ID
app.delete("/mensagens/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM mensagens WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: "Mensagem não encontrada" });
    }
    res.json({ sucesso: true, mensagem: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao excluir mensagem" });
  }
});

// 🔹 Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor Node.js + PostgreSQL está rodando com sucesso!");
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
