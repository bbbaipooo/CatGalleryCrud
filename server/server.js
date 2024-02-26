import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
const salt = 10;

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: ["https://cat-gallery-crud.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true 
    
}));

app.use(cookieParser());

app.use(express.static('public'))

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

const db = mysql.createConnection({
    host: "viaduct.proxy.rlwy.net",
    user: "root",
    password: "1fD1c2BA1bG1b4dcFF4156D3h1BAhafa",
    database: "railway",
    port:20974
})

app.get("/helloWorld",(req,res)=>{
    return res.json();
})


//AUTHEN ---------------------------------

app.get("/login", (req, res) => {
    const log = "SELECT * FROM login"
    db.query(log, (err, data) => {
        if (err) {
            console.error("Error connecting to MySQL::", err);
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post('/register', (req, res) => {
    // const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
    const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?,?,?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error for hassing password" });
        const values = [
            req.body.name,
            req.body.email,
            hash
        ]
        // db.query(sql, [values], (err, result) => {
        db.query(sql, values, (err, result) => {
            if (err) return res.json({ Error: err });
            return res.json({ Status: "Success" })
        })
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Error login at server" })
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const name = data[0].name;
                    const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token)
                    return res.json({ Status: "Success" });
                } else {
                    return res.json(({ Error: "Password not matched" }))
                }
            })
        } else {
            return res.json({ Error: "No email existed" });
        }
    })
})


const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticates" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/verify', verifyUser, (req, res) => {//default path /
    return res.json({ Status: "Success", name: req.name });
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "success" })
})

//CRUD CAT -------------------------------
app.get('/cats', (req, res) => {
    db.query("SELECT * FROM cats", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/createCat', upload.single("image"), (req, res) => {
    const sql = 
    "INSERT INTO cats (`name`, `age`, `gender`, `temperament`,`image`) VALUES (?, ?, ?, ?, ?)";
    const values = [
        req.body.name,
        req.body.age,
        req.body.gender,
        req.body.temperament,
        req.file.filename
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err.message)
            return res.json({ Error: err.message }); // Send the error message to the client for debugging.
        }
        return res.json({ Status: "Success" });
    });

})

app.put('/updateCat/:id', upload.single("image"), (req, res) => {
    const catId=req.params.id;
    const sql = 
    "UPDATE cats SET `name` = ?, `age` = ?, `gender` = ?, `temperament` = ?, `image` = ? WHERE id = ?";
    const values = [
        req.body.name,
        req.body.age,
        req.body.gender,
        req.body.temperament,
        req.file ? req.file.filename : req.body.image,
        catId
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err.message)
            return res.json({ Error: err.message }); // Send the error message to the client for debugging.
        }
        return res.json({ Status: "Success" });
    });

})

app.delete('/deleteCat/:id', (req, res) => {
    const sql = "DELETE FROM cats WHERE id = ?";
    const id = req.params.id;
    db.query(sql, id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

//port ---------------------------------
app.listen(port, "0.0.0.0", function () {
    console.log("Server is running on port 8800.")
})
