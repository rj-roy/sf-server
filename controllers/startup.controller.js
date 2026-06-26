import { getCollections } from '../config/db.js';
import { toObjectId } from '../utils/toObjectId.js';
import { ApiError } from '../utils/ApiError.js';
import { requireFields } from '../utils/requireFields.js';

export const createStartup = async (req, res) => {
    const { startupsCollection } = getCollections();
    const result = await startupsCollection.insertOne(req.body);
    res.send(result);
};

export const updateStartupStatus = async (req, res) => {
    const { startupsCollection } = getCollections();
    const startupId = toObjectId(req.params.id, 'startup ID');

    const result = await startupsCollection.findOneAndUpdate(
        { _id: startupId },
        { $set: req.body },
        { returnDocument: 'after' },
    );

    if (!result) {
        throw new ApiError(404, 'Startup not found');
    }

    res.send({ success: true, data: result });
};

export const getAllStartups = async (req, res) => {
    const { startupsCollection } = getCollections();
    const result = await startupsCollection.find().toArray();
    res.send(result);
};

export const getApprovedStartups = async (req, res) => {
    const { startupsCollection } = getCollections();
    const result = await startupsCollection.find({ status: 'approved' }).toArray();
    res.send(result);
};

export const getPendingStartups = async (req, res) => {
    const { startupsCollection } = getCollections();
    const result = await startupsCollection.find({ status: 'pending' }).toArray();
    res.send(result);
};

export const getRejectedStartups = async (req, res) => {
    const { startupsCollection } = getCollections();
    const result = await startupsCollection.find({ status: 'rejected' }).toArray();
    res.send(result);
};

export const getStartupsByField = async (req, res) => {
    const { startupsCollection } = getCollections();
    const field = req.query.field_name;

    requireFields(req.query, ['field_name']);

    const result = await startupsCollection.distinct(field);
    res.send(result);
};

export const getStartupById = async (req, res) => {
    const { startupsCollection } = getCollections();
    const id = toObjectId(req.params.id, 'startup ID');
    const result = await startupsCollection.findOne({ _id: id });

    if (!result) {
        throw new ApiError(404, 'Startup not found');
    }

    res.send(result);
};

export const getStartupByFounder = async (req, res) => {
    const { startupsCollection } = getCollections();
    const result = await startupsCollection.findOne({ 'founder.founder_id': req.params.id });
    res.send(result);
};

export const updateStartup = async (req, res) => {
    const { startupsCollection } = getCollections();
    const startupId = toObjectId(req.params.id, 'startup ID');

    // _id is stripped so a caller can never overwrite the document's own id.
    const { _id, ...updateData } = req.body;

    const result = await startupsCollection.findOneAndUpdate(
        { _id: startupId },
        { $set: updateData },
        { returnDocument: 'after' },
    );

    if (!result) {
        throw new ApiError(404, 'Startup not found');
    }

    res.send(result);
};

export const deleteStartup = async (req, res) => {
    const { startupsCollection } = getCollections();
    const id = toObjectId(req.params.id, 'startup ID');
    const result = await startupsCollection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
        throw new ApiError(404, 'Startup not found');
    }

    res.send({ success: true, data: result });
};