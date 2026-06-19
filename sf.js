require('dotenv').config();

const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

const run = async () => {
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const startupsCollection = await db.collection(process.env.STARTUPS_COLLECTION);

        app.get('/startups', async (req, res) => {
            const cursor = startupsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

    } catch (error) {
        // console.error('Error connecting to MongoDB:', error);
    };
};

run().catch(console.dir);
app.listen(PORT, (req, res) => {
    console.log('running...!');
});