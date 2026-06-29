import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import userRoutes from './routes/user.routes.js';
import usersRoutes from './routes/users.routes.js';
import startupRoutes from './routes/startup.routes.js';
import startupsRoutes from './routes/startups.routes.js';
import opportunityRoutes from './routes/opportunity.routes.js';
import opportunitiesRoutes from './routes/opportunities.routes.js';
import opportunityActionsRoutes from './routes/opportunityActions.routes.js';
import applicationRoutes from './routes/application.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import planRoutes from './routes/plan.routes.js';

const app = express();

app.use(cors({
    origin: (process.env.CLIENT_URL || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        ? process.env.ADMIN_EMAIL : true,

    credentials: true,
}));

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/users', usersRoutes);

app.use('/api/startup', startupRoutes);
app.use('/api/startups', startupsRoutes);

app.use('/api/opportunity', opportunityRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/opportunities', opportunityActionsRoutes);

app.use('/api/application', applicationRoutes);
app.use('/api/applications', applicationsRoutes);

app.use('/api/subscription', subscriptionRoutes);

app.use('/api/plan', planRoutes);

app.get('/', (req, res) => {
    res.send('Startup Forge API is running');
});

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PROT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

start();