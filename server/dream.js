import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";

const salt = 10;

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "UPDATE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));

// ============================= Authen ===============================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin1234",
  database: "book-store",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connected to the MySQL server.");
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not ok" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.post("/register", (req, res) => {
  const sql = "INSERT INTO authen (`name`, `email`, `password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Hashing password error" });
    const values = [req.body.name, req.body.email, hash];
    db.query(sql, [values], (err, result) => {
      if (err) return res.json(err);
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM authen WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "Password error" });
          if (response) {
            const name = data[0].name;
            const token = jwt.sign({ name }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "Password not matched" });
          }
        }
      );
    } else {
      return res.json({ Error: "No email existed" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

// ============================= Books ===============================

app.get("/books", (req, res) => {
  const sql = "SELECT * FROM books";
  db.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/books", upload.single("image"), (req, res) => {
  const sql =
    "INSERT INTO books (`name`, `description`, `editor`, `price`, `author`, `subtitle`, `image`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.description,
    req.body.editor,
    req.body.price,
    req.body.author,
    req.body.subtitle,
    req.file.filename
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json("Created successfully");
  });
});

app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const sql = "DELETE FROM books WHERE id = ?";
    db.query(sql, [bookId], (err, data) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Error deleting book" });
      }
      return res.json({ status: "Deleted book" });
    });
  });

// ===================================================================

app.listen(3001, () => {
  console.log("Server is running");
});
