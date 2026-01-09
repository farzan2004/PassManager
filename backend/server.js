const express = require('express');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const client = new MongoClient(process.env.MONGO_URI);
const googleClient = new OAuth2Client();

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB", err);
    }
}
connectDB();

const app = express();
const port = 5000;
app.use(bodyparser.json());
app.use(cors());

// Authenticate User
app.post('/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { email, name } = ticket.getPayload();
        
        const db = client.db(process.env.DB_NAME);
        let user = await db.collection('users').findOne({ email });

        if (!user) {
            console.log("User not found, creating new user...");
            const newUser = { email, name };
            const result = await db.collection('users').insertOne(newUser);
            console.log("New user created:", result);
            user = { _id: result.insertedId, ...newUser };
        } else {
            console.log("User found:", user);
        }

        res.json({ userId: user._id, email, name });
    } catch (err) {
        console.error("Error during Google authentication:", err);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Get User's Passwords
app.get('/passwords/:userId', async (req, res) => {
    const db = client.db(process.env.DB_NAME);
    const passwords = await db.collection('passwords').find({ userId: req.params.userId }).toArray();
    res.json(passwords);
});

// Save Password
app.post('/passwords', async (req, res) => {
    const { userId, site, username, password } = req.body;
    const db = client.db(process.env.DB_NAME);
    await db.collection('passwords').insertOne({ userId, site, username, password });
    res.json({ success: true });
});

// Delete Password
app.delete('/passwords', async (req, res) => {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ObjectId" });
    }

    const db = client.db(process.env.DB_NAME);
    await db.collection('passwords').deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// //{
//     "userId": "67cfe2116d6a5c27df1de264",
//     "email": "farzanrashid2004@gmail.com",
//     "name": "farzan rashid"
// }