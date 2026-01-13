import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./schemas/userModel.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { encrypt, decrypt } from "./utils/crypto.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

const client = new MongoClient(process.env.MONGO_URI);
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log("✅ MongoDB connected");

        app.listen(5000, () => {
            console.log("🚀 Server running on port 5000");
        });
    } catch (err) {
        console.error("❌ DB connection failed", err);
        process.exit(1);
    }
})();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

await client.connect();
// console.log("✅ Connected to MongoDB");

app.get("/auth/me", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId)
        .select("name email");

    res.json({
        authenticated: true,
        user,
    });
});

// SignUp
app.post("/auth/signup", async (req, res) => {
    try {
        const { provider } = req.body;

        if (provider === "google") {
            const { token } = req.body;

            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const { email, name, sub } = ticket.getPayload();

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    name,
                    email,
                    authProvider: "google",
                    googleSub: sub,
                });
            }

            return res.status(200).json({
                userId: user._id,
                email: user.email,
                name: user.name,
            });
        }
        if (provider === "local") {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: "User already exists" });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                passwordHash,
                authProvider: "local",
            });

            const jwtToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            return res.status(201).json({
                userId: user._id,
                email: user.email,
                name: user.name,
            });
        }

        return res.status(400).json({ error: "Invalid provider" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup failed" });
    }
});

app.post("/auth/login", async (req, res) => {
    console.log("🔥 /auth/login HIT", req.body);
    try {
        const { provider } = req.body;

        // ----------- GOOGLE LOGIN -----------
        if (provider === "google") {
            const { token } = req.body;

            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const { email, name, sub } = ticket.getPayload();

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    name,
                    email,
                    authProvider: "google",
                    googleSub: sub,
                });
            }

            const jwtToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            return res.json({
                name: user.name,
                email: user.email,
            });
        }

        if (provider === "local") {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Missing fields" });
            }

            const user = await User.findOne({ email });
            if (!user || user.authProvider !== "local") {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const jwtToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            return res.json({
                name: user.name,
                email: user.email,
            });
        }

        return res.status(400).json({ error: "Invalid provider" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
})

app.post("/auth/logout", (req, res) => {
    console.log("Log out endpoint hit.")
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({ success: true });
});

// Get passwords
app.get("/passwords", authMiddleware, async (req, res) => {
    const db = client.db(process.env.DB_NAME);
    const userId = req.user.userId;

    const records = await db
        .collection("passwords")
        .find({ userId })
        .toArray();

    const decrypted = records.map(item => ({
        ...item,
        password: decrypt(item.password),
    }));

    res.json(decrypted);
});

// Save password
app.post("/passwords", authMiddleware, async (req, res) => {
    const { site, username, password } = req.body;
    const userId = req.user.userId;
    const db = client.db(process.env.DB_NAME);

    const document = await db.collection("passwords").insertOne({
        userId,
        site,
        username,
        password: encrypt(password),
        createdAt: new Date(),
    });

    res.json({
        _id: document.insertedId,
        userId,
        site,
        username,
        success: true
    });
});

//update password
app.put("/passwords/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ObjectId" });
    }
    const { site, username, password } = req.body;
    const userId = req.user.userId;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("passwords").updateOne(
        { _id: new ObjectId(id), userId }, // ownership check
        {
            $set: {
                site,
                username,
                password: encrypt(password),
                updatedAt: new Date(),
            },
        }
    );
    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Password not found or unauthorized" });
    }

    res.json({ success: true });
})

// Delete password
app.delete("/passwords/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const db = client.db(process.env.DB_NAME);

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ObjectId" });
    }

    const result = await db.collection("passwords").deleteOne({
        _id: new ObjectId(id),
        userId,
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Password not found" });
    }

    res.json({ success: true });
});