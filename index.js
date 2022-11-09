const express = require("express");
const dbClient = require("./db");

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.get("/todos", async (req, res) => {
  const response = await dbClient.query("SELECT * FROM todos");
  res.status(200).json(response.rows);
});

app.post("/todos", async (req, res) => {
  const name = req.body.name;
  if (!name) {
    res.status(400).json({ message: "Must have name!" });
  }

  await dbClient.query("INSERT INTO todos(name) VALUES ($1)", [name]);

  res.status(201).json({ message: "Item has been created!" });
});

app.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  if (!name) {
    res.status(400).json({ message: "Must have name!" });
  }

  await dbClient.query("UPDATE todos SET name=$1 WHERE id=$2", [name, id]);

  res.status(200).json({ message: "Item description has been changed!" });
});

app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  await dbClient.query("DELETE FROM todos WHERE id=$1", [id]);

  res.status(200).json({ message: "Item has been deleted!" });
});

app.listen(port, () => console.log(`Listen on port ${port}`));
