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
        strict: false,
        deprecationErrors: true,
    },
});

const run = async () => {
    try {
        await client.connect();
        const db = await client.db(process.env.DB_NAME);
        const startupsCollection = await db.collection(process.env.STARTUPS_COLLECTION);
        const opportunitiesCollection = await db.collection(process.env.OPPORTUNITIES_COLLECTION);

        app.get('/api/startups', async (req, res) => {
            const cursor = startupsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/api/startups/field', async (req, res) => {
            const field = req.query.field_name;
            const cursor = await startupsCollection.distinct(field);
            res.send(cursor);
        });

        app.get('/api/startups/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await startupsCollection.findOne(query);
            res.send(result);
        });

        app.get('/api/startups/founder/:id', async (req, res) => {
            const id = req.params.id;
            const result = await startupsCollection.findOne(
                { 'founder.founder_id': id },
            )
            res.send(result);
        });

        app.patch('/api/startup/:id', async (req, res) => {
            const id = req.params.id;
            const { _id, ...updateData } = req.body;
            const filter = { _id: new ObjectId(id) };

            const result = await startupsCollection.findOneAndUpdate(
                filter,
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!result) {
                return res.status(404).send({ error: 'Startup not found' });
            }
            res.send(result);
        });

        app.post('/api/startup/create', async (req, res) => {
            const data = req.body;
            const result = await startupsCollection.insertOne(data);
            res.send(result);
        });

        app.delete('/api/startup/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await startupsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.post('/api/opportunities/create', async (req, res) => {
            const data = req.body;
            const result = await opportunitiesCollection.insertOne(data);
            res.send(result);
        });

    } finally {
        // console.error('Error connecting to MongoDB:', error);
    };
};

run().catch(console.dir);
app.listen(PORT, (req, res) => {
    console.log('running...!');
});