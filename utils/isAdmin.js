import { env } from '../config/env.js';

export const isAdmin = (user) => {
    return user?.role === 'admin' && user?.email === 'admin765i@admin.admin';
};
