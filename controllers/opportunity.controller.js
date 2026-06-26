import { getCollections } from '../config/db.js';
import { toObjectId } from '../utils/toObjectId.js';
import { ApiError } from '../utils/ApiError.js';

export const createOpportunity = async (req, res) => {
    const { opportunitiesCollection } = getCollections();
    const result = await opportunitiesCollection.insertOne(req.body);
    res.send(result);
};

export const getAllOpportunities = async (req, res) => {
    const { opportunitiesCollection } = getCollections();
    const result = await opportunitiesCollection.find().toArray();
    res.send(result);
};

export const getOpportunitiesByFounder = async (req, res) => {
    const { opportunitiesCollection } = getCollections();
    const result = await opportunitiesCollection.find({ founder_id: req.params.id }).toArray();
    res.send(result);
};

export const getOpportunitiesByStartup = async (req, res) => {
    const { opportunitiesCollection } = getCollections();
    const result = await opportunitiesCollection.find({ startup_id: req.params.id }).toArray();
    res.send({ success: true, data: result });
};

export const deleteOpportunity = async (req, res) => {
    const { opportunitiesCollection } = getCollections();
    const id = toObjectId(req.params.id, 'opportunity ID');
    const result = await opportunitiesCollection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
        throw new ApiError(404, 'Opportunity not found');
    }

    res.send({ success: true, data: result });
};

export const updateOpportunity = async (req, res) => {
    const { opportunitiesCollection } = getCollections();
    const id = toObjectId(req.params.id, 'opportunity ID');
    const { _id, ...updateData } = req.body;

    const result = await opportunitiesCollection.findOneAndUpdate(
        { _id: id },
        { $set: updateData },
        { returnDocument: 'after' },
    );

    if (!result) {
        throw new ApiError(404, 'Opportunity not found');
    }

    res.send(result);
};