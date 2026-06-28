import { getCollections } from '../config/db.js';
import { toObjectId } from '../utils/toObjectId.js';
import { ApiError } from '../utils/ApiError.js';
import { requireFields } from '../utils/requireFields.js';
import { ObjectId } from 'mongodb';

export const getAllUsers = async (req, res) => {
    const { userCollection } = getCollections();
    const result = await userCollection.find().toArray();
    res.send({ success: true, data: result });
};

export const updateUserStatus = async (req, res) => {
    const { userCollection } = getCollections();
    const userId = toObjectId(req.params.id, 'user ID');

    requireFields(req.body, ['status']);
    const { status } = req.body;

    const result = await userCollection.findOneAndUpdate(
        { _id: userId },
        { $set: { status } },
        { returnDocument: 'after' },
    );

    if (!result) {
        throw new ApiError(404, 'User not found');
    }

    res.send({
        success: true,
        message: 'User status updated successfully',
        data: result,
    });
};

export const updateUserPlan = async (req, res) => {
    const { userCollection } = getCollections();
    const userId = req.params.id;
    const { plan } = req.body;

    const result = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { plan } },
        { returnDocument: 'after' },
    );

    if (!result) {
        throw new ApiError(404, 'User not found');
    };

    res.send({
        success: true,
        message: `Plan Updated to ${plan}`
    });
};
export const updateOwnProfile = async (req, res) => {
    const { userCollection } = getCollections();
    const targetId = toObjectId(req.params.id, 'user ID');

    const authenticatedId = req.user?._id?.toHexString();
    if (authenticatedId !== targetId.toHexString()) {
        throw new ApiError(403, 'You are not authorized to update this profile');
    }

    const { name, email, profileImage } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, 'No valid fields provided to update');
    }

    const result = await userCollection.findOneAndUpdate(
        { _id: targetId },
        { $set: updateFields },
        { returnDocument: 'after' },
    );

    if (!result) {
        throw new ApiError(404, 'User not found');
    }

    res.send(result);
};