import { getCollections } from "../config/db.js"

export const getPlan = async (req, res) => {
    const { planCollection } = getCollections();
    const result = await planCollection.find().toArray();
    res.send({
        success: true,
        data: result,
    });
};