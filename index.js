\const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "yamabiko.proxy.rlwy.net",
  user: "root",
  password: "eqHXoiOyleLeGIayLTafQoxdPmCxAjHI",
  database: "railway",
  port: 17285
});

db.connect(err => {
  if (err) {
    console.error(err);
  }
});

app.get("/", (req, res) => {
  res.json({ status: "API working" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: false, message: "Email and password required" });
  }

  const sql = "SELECT id, password FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      return res.json({ status: false, message: "DB error" });
    }

    if (result.length === 0) {
      return res.json({ status: false, message: "Invalid login" });
    }

    if (result[0].password !== password) {
      return res.json({ status: false, message: "Invalid login" });
    }

    res.json({
      status: true,
      message: "Login successful",
      user_id: result[0].id
    });
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT);
 
