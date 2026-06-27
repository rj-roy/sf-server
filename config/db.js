import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from './env.js';

const client = new MongoClient(env.dbUri, {
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

    db = client.db(env.dbName);

    collections = {
        userCollection: db.collection(env.collections.users),
        startupsCollection: db.collection(env.collections.startups),
        opportunitiesCollection: db.collection(env.collections.opportunities),
        applicationsCollection: db.collection(env.collections.applications),
        sessionCollection: db.collection(env.collections.sessions),
        subscriptonCollection: db.collection(env.collections.subscription),
        planCollection: db.collection(env.collections.plan),
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
