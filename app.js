import dotenv from "dotenv";
import express from "express";
import { createPool } from "mysql";
import cors from "cors";
import { db } from "./db.js";

dotenv.config();

const connectionPool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const app = express();
const port = process.env.APP_PORT;

app.use(cors());

app.get("/:orderId", (req, res) => {
  if (!isNaN(req.params.orderId)) {
    db(connectionPool)
      .select("SELECT * FROM link WHERE order_id = ?", [req.params.orderId])
      .then((queryResult) => {
        res.send(queryResult);
      })
      .catch(() => res.send("Error"));
  } else {
    res.status(422).json({ error: "Missing parameters" });
  }
});

app.listen(port, () => {
  console.log(`App started listening at http://localhost:${port}`);
});
