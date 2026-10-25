
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "authentication_db"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

app.get("/", (req, res) => {
    res.send("Authentication System Backend is Running!");
});

const bcrypt = require("bcrypt");

// User Registration API
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [username.trim(), email.trim().toLowerCase(), hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            message: "Username or email already exists"
                        });
                    }

                    console.error(err.message);
                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.status(201).json({
                    message: "User registered successfully",
                    userId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


const jwt = require("jsonwebtoken");

// User Login API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email.trim().toLowerCase()], async (err, results) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: "Login failed"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        try {
            const user = results[0];
            const isMatch = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Login successful",
                token: token,
                username: user.username
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({
                message: "Something went wrong"
            });
        }
    });
});

const crypto = require("crypto");

// Authentication Middleware

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. Please login first."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const sql = `
            SELECT id FROM revoked_tokens
            WHERE token_hash = ? AND expires_at > NOW()
        `;

        db.query(sql, [tokenHash], (err, results) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    message: "Authentication check failed"
                });
            }

            if (results.length > 0) {
                return res.status(401).json({
                    message: "Token has been revoked. Please login again."
                });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


// Protected Profile API
app.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Access granted!",
        userId: req.user.id,
        email: req.user.email
    });
});

const logoutSql = `
    INSERT INTO revoked_tokens (token_hash, expires_at)
    VALUES (?, ?)
`;

// Logout API
app.post("/logout", verifyToken, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const expiresAt = new Date(req.user.exp * 1000);

    db.query(logoutSql, [tokenHash, expiresAt], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.json({
            message: "Logout successful"
        });
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
