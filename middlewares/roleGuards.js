import { isAdmin } from '../utils/isAdmin.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyAdmin = (req, res, next) => {
    if (!isAdmin(req.user)) {
        throw new ApiError(403, 'Admin access required');
    }
    next();
};

export const verifyFounder = (req, res, next) => {
    if (req.user?.role !== 'founder') {
        throw new ApiError(403, 'Founder access required');
    }
    next();
};

export const verifyCollaborator = (req, res, next) => {
    if (req.user?.role !== 'collaborator') {
        throw new ApiError(403, 'Collaborator access required');
    }
    next();
};
