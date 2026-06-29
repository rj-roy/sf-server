import { MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
});

let db = null;
let collections = null;

export const connectDB = async () => {
    if (db) return db;

    await client.connect();
    await client.db('admin').command({ ping: 1 });

    db = client.db(process.env.DB_NAME);

    collections = {
        userCollection: db.collection(process.env.USERS_COLLECTION),
        startupsCollection: db.collection(process.env.STARTUPS_COLLECTION),
        opportunitiesCollection: db.collection(process.env.OPPORTUNITIES_COLLECTION),
        applicationsCollection: db.collection(process.env.APPLICATIONS_COLLECTION),
        sessionCollection: db.collection(process.env.SESSION_COLLECTION),
        subscriptonCollection: db.collection(process.env.SUBSCRIPTION_COLLECTION),
        planCollection: db.collection(process.env.PLAN_COLLECTION),
    };

    console.log('MongoDB connected');
    return db;
};

export const getCollections = () => {
    if (!collections) {
        throw new Error('Database not initialized — connectDB() must run before any request is handled.');
    }
    return collections;
};

export const disconnectDB = async () => {
    await client.close();
    db = null;
    collections = null;
};
