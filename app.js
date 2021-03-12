require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const connectionPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const app = express();
const port = process.env.APP_PORT;

app.use(cors());

app.get("/", (req, res) => {
  db(connectionPool)
    .select("SELECT * FROM link")
    .then((queryResult) => {
      res.send(queryResult);
    })
    .catch(() => res.send("Error"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const db = (connectionPool) => {
  return {
    select: (query) => {
      return new Promise((resolve, reject) => {
        try {
          connectionPool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.query(query, function (err, result) {
              connection.release();
              if (err) throw err;

              resolve(result);
            });
          });
        } catch (error) {
          console.error("Error: " + error);
          connection.release();
          reject();
        }
      });
    },
  };
};
