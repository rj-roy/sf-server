import { getCollections } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { toObjectId } from '../utils/toObjectId.js';

export const verifyToken = async (req, res, next) => {
    const { sessionCollection, userCollection } = getCollections();

    const authHeader = req.headers?.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, 'Unauthorized: no token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new ApiError(401, 'Unauthorized: malformed authorization header');
    }

    const session = await sessionCollection.findOne({ token });
    if (!session) {
        throw new ApiError(401, 'Session expired or invalid');
    }

    const userId = toObjectId(session.userId, 'session user id');

    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
        throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
};
