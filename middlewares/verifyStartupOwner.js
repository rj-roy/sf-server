import { getCollections } from '../config/db.js';
import { isAdmin } from '../utils/isAdmin.js';
import { toObjectId } from '../utils/toObjectId.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyStartupNotAlreadyCreated = async (req, res, next) => {
    const { startupsCollection } = getCollections();

    const founderId = req.user?._id?.toHexString();
    const existing = await startupsCollection.findOne(
        { 'founder.founder_id': founderId },
        { projection: { _id: 1 } },
    );

    if (existing) {
        throw new ApiError(403, 'You already have a registered startup');
    }
    next();
};

export const verifyStartupOwner = async (req, res, next) => {
    if (isAdmin(req.user)) {
        return next();
    }

    if (req.user?.role !== 'founder') {
        throw new ApiError(403, 'Founder access required');
    }

    const { startupsCollection } = getCollections();
    const startupId = toObjectId(req.params.id, 'startup ID');
    const founderId = req.user?._id?.toHexString();

    const owned = await startupsCollection.findOne(
        { _id: startupId, 'founder.founder_id': founderId },
        { projection: { _id: 1 } },
    );

    if (!owned) {
        throw new ApiError(403, 'You do not own this startup');
    }
    next();
};
