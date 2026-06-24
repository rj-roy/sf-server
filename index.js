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
        const db = await client.db(process.env.DB_NAME);
        const userCollection = await db.collection(process.env.USERS_COLLECTION);
        const startupsCollection = await db.collection(process.env.STARTUPS_COLLECTION);
        const opportunitiesCollection = await db.collection(process.env.OPPORTUNITIES_COLLECTION);
        const applicationsCollection = await db.collection(process.env.APPLICATIONS_COLLECTION);
        const sessionCollection = await db.collection(process.env.SESSION_COLLECTION);

        const verifyToken = async (req, res, next) => {
            const authHeader = req.headers?.authorization;
            if (!authHeader) {
                return res.status(401).send({ message: 'Unauthorized Acces' });
            };

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).send({ message: 'Unauthorized T Access' });
            };

            const query = { token: token };
            const session = await sessionCollection.findOne(query);
            if (!session) {
                return res.status(401).send({ message: 'Sorry! session not found.' });
            };

            const userQuery = { _id: session?.userId };
            const user = await userCollection.findOne(userQuery);
            if (!user) {
                return res.status(404).send({ message: 'User Not Found' });
            };

            req.user = user;
            next();
        };

        const verifyAdmin = async (req, res, next) => {
            if (req.user?.role !== 'admin') {
                return res.status(403).send({ message: 'Unauthorized Users Access' });
            } else if (req.user?.role === 'admin') {
                next();
            };
        };

        const verifyCollaborator = async (req, res, next) => {
            if (req.user?.role !== 'collaborator') {
                return res.status(403).send({ message: 'Unauthorized Users Access' });
            } else if (req.user?.role === 'collaborator') {
                next();
            };
        };


        app.get('/api/users', verifyToken, verifyAdmin, async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send({
                success: true,
                data: result
            });
        });

        app.patch('/api/users/update/status/:id', verifyToken, verifyAdmin, async (req, res) => {
            const userId = req.params.id;
            const { status } = req.body;
            const query = { _id: new ObjectId(userId) };

            const result = await userCollection.findOneAndUpdate(
                query,
                { $set: { status } },
                { returnDocument: "after" },
            );
            res.send({
                success: true,
                message: "User status updated successfully",
                data: result
            });
        });

        app.patch('/api/user/update/:id', async (req, res) => {
            const { id } = req.params;
            const { name, email, profileImage } = req.body;
            const updateDoc = {
                $set: {}
            };

            if (name !== undefined) {
                updateDoc.$set.name = name;
            };
            if (email !== undefined) {
                updateDoc.$set.email = email;
            };
            if (profileImage !== undefined) {
                updateDoc.$set.profileImage = profileImage;
            };

            const result = await userCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                updateDoc,
                {
                    returnDocument: "after"
                }
            );
            res.send(result);
        });

        app.post('/api/startup/create', async (req, res) => {
            const data = req.body;
            const result = await startupsCollection.insertOne(data);
            res.send(result);
        });

        app.patch('/api/startup/status/update/:id', async (req, res) => {
            const startupId = req.params.id;
            const newStatus = req.body;
            const query = { _id: new ObjectId(startupId) };
            const result = await startupsCollection.findOneAndUpdate(
                query,
                {
                    $set: newStatus
                },
                { returnDocument: 'after' },
            );

            if (!result) {
                return res.status(404).send(
                    { success: false, error: 'Something went wrong! Please try again later.' });
            };

            res.send({
                success: true,
                data: result,
            });
        });

        app.get('/api/startups', async (req, res) => {
            const cursor = startupsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/api/startups/approved', async (req, res) => {
            const query = { status: 'approved' };
            const result = await startupsCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/api/startups/pending', async (req, res) => {
            const query = { status: 'pending' };
            const result = await startupsCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/api/startups/rejected', async (req, res) => {
            const query = { status: 'rejected' };
            const result = await startupsCollection.find(query).toArray();
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

        app.delete('/api/startup/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await startupsCollection.deleteOne({ _id: new ObjectId(id) });
            res.send({
                success: true,
                data: result,
            });
        });

        app.post('/api/opportunities/create', async (req, res) => {
            const data = req.body;
            const result = await opportunitiesCollection.insertOne(data);
            res.send(result);
        });

        app.get('/api/opportunities', async (req, res) => {
            const cursor = opportunitiesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/api/opportunities/founder/:id', async (req, res) => {
            const id = req.params.id;
            const result = await opportunitiesCollection.find(
                { 'founder_id': id },
            ).toArray()
            res.send(result);
        });

        app.get('/api/opportunities/startup/:id', async (req, res) => {
            const startupId = req.params.id;
            const result = await opportunitiesCollection.find({ 'startup_id': startupId }).toArray();
            res.send({
                status: true,
                data: result,
            });
        });

        app.delete('/api/opportunities/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await opportunitiesCollection.deleteOne({ _id: new ObjectId(id) });
            res.send({
                success: true,
                data: result,
            });
        });

        app.patch('/api/opportunities/update/:id', async (req, res) => {
            const id = req.params.id;
            const { _id, ...updateData } = req.body;
            const filter = { _id: new ObjectId(id) };

            const result = await opportunitiesCollection.findOneAndUpdate(
                filter,
                { $set: updateData },
                { returnDocument: 'after' }
            );
            if (!result) {
                return res.status(404).send({ error: 'Startup not found' });
            }
            res.send(result);
        });

        app.post('/api/opportunity/application/create', async (req, res) => {
            const data = req.body;
            const result = await applicationsCollection.insertOne(data);
            res.send(result);
        });

        app.get('/api/application/founder/:id', async (req, res) => {
            const founderId = req.params.id;
            const query = { founderId: founderId };
            const result = await applicationsCollection.find(query).toArray();
            res.send({
                success: true,
                data: result,
            });
        });

        app.get('/api/application/collaborator/:id', async (req, res) => {
            const colId = req.params.id;
            const query = { userId: colId };

            const result = await applicationsCollection.find(query).toArray();
            if (!result) {
                return res.status(404).send({ error: 'Application not found' });
            };
            res.send({
                success: true,
                data: result,
            });
        });

        app.get('/api/applications', async (req, res) => {
            const result = await applicationsCollection.find().toArray();
            res.send({
                success: true,
                data: result,
            });
        });

        app.patch('/api/application/update/status/:id', async (req, res) => {
            const id = req.params.id;
            const { status } = req.body;

            const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
            if (!status || !validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status. Must be one of: pending, approved, rejected"
                });
            };

            const filter = { _id: new ObjectId(id) };

            const result = await applicationsCollection.findOneAndUpdate(
                filter,
                { $set: req.body },
                { returnDocument: 'after' }
            );
            if (!result) {
                return res.status(404).send({ error: 'Something went wrong!' });
            };
            res.send({
                success: true,
                data: result,
            });
        });

    } finally {
        // console.error('Error connecting to MongoDB:', error);
    };
};

run().catch(console.dir);
app.listen(PORT, (req, res) => {
    console.log('running...!');
});