import { getCollections } from '../config/db.js';
import { toObjectId } from '../utils/toObjectId.js';
import { ApiError } from '../utils/ApiError.js';
import { requireFields } from '../utils/requireFields.js';

const APPLICATION_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'];

export const createApplication = async (req, res) => {
    const { applicationsCollection } = getCollections();
    const result = await applicationsCollection.insertOne(req.body);
    res.send(result);
};

export const getApplicationsByFounder = async (req, res) => {
    const { applicationsCollection } = getCollections();
    const result = await applicationsCollection.find({ founderId: req.params.id }).toArray();
    res.send({ success: true, data: result });
};

export const getApplicationsByCollaborator = async (req, res) => {
    const { applicationsCollection } = getCollections();
    const result = await applicationsCollection.find({ userId: req.params.id }).toArray();
    res.send({ success: true, data: result });
};

export const getAllApplications = async (req, res) => {
    const { applicationsCollection } = getCollections();
    const result = await applicationsCollection.find().toArray();
    res.send({ success: true, data: result });
};

const buildUpdateStatusHandler = (allowCancelled) => async (req, res) => {
    const { applicationsCollection } = getCollections();
    const id = toObjectId(req.params.id, 'application ID');

    requireFields(req.body, ['status']);
    const { status } = req.body;

    const validStatuses = allowCancelled
        ? APPLICATION_STATUSES
        : APPLICATION_STATUSES.filter((s) => s !== 'cancelled');

    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const result = await applicationsCollection.findOneAndUpdate(
        { _id: id },
        { $set: req.body },
        { returnDocument: 'after' },
    );

    if (!result) {
        throw new ApiError(404, 'Application not found');
    }

    res.send({ success: true, data: result });
};

export const updateApplicationStatus = buildUpdateStatusHandler(false);
export const cancelApplicationStatus = buildUpdateStatusHandler(true);