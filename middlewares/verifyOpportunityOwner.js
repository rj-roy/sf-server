import { getCollections } from '../config/db.js';
import { isAdmin } from '../utils/isAdmin.js';
import { toObjectId } from '../utils/toObjectId.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyOpportunityOwner = async (req, res, next) => {
    if (isAdmin(req.user)) {
        return next();
    }

    const { opportunitiesCollection } = getCollections();
    const opportunityId = toObjectId(req.params.id, 'opportunity ID');
    const founderId = req.user?._id?.toHexString();

    const owned = await opportunitiesCollection.findOne(
        { _id: opportunityId, founder_id: founderId },
        { projection: { _id: 1 } },
    );

    if (!owned) {
        throw new ApiError(403, 'You do not own this opportunity');
    }
    next();
};
