const required = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    };
    return value;
};

export const env = {
    port: process.env.PORT || 5000,

    dbUri: required('DB_URI'),
    dbName: required('DB_NAME'),

    collections: {
        users: required('USERS_COLLECTION'),
        startups: required('STARTUPS_COLLECTION'),
        opportunities: required('OPPORTUNITIES_COLLECTION'),
        applications: required('APPLICATIONS_COLLECTION'),
        sessions: required('SESSION_COLLECTION'),
    },

    clientOrigins: (process.env.CLIENT_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),

    adminEmail: required('ADMIN_EMAIL'),
};
