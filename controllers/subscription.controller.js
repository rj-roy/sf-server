import { getCollections } from "../config/db.js"

export const createSubscription = async (req, res) => {
    const { subscriptonCollection } = getCollections();
    const data = req.body;
    const result = await subscriptonCollection.insertOne(data);
    res.send({
        success: true,
        data: result,
    });
};