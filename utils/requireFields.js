import { ApiError } from './ApiError.js';

export const requireFields = (obj, keys) => {
    const missing = keys.filter((key) => obj?.[key] === undefined || obj?.[key] === null || obj?.[key] === '');
    if (missing.length) {
        throw new ApiError(400, `Missing required field(s): ${missing.join(', ')}`);
    }
};
