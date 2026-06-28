import { getCollections } from "../config/db.js"

export const createSubscription = async (req, res) => {
    const { subscriptonCollection } = getCollections();
    const data = req.body;

    if (!data?.sessionId) {
        return res.status(400).send({
            success: false,
            message: 'sessionId is required for idempotent subscription creation',
        });
    }

    const existing = await subscriptonCollection.findOne({ sessionId: data.sessionId });
    if (existing) {
        return res.send({
            success: false,
            message: 'Subscription already exists',
            data: {
                heading: "You're all done here",
                paragraph: "You've either completed your payment or this checkout session has timed out."
            },
        });
    }

    const result = await subscriptonCollection.insertOne(data);
    res.send({
        success: true,
        data: result,
    });
};

export const isExistSubscription = async (req, res, next) => {
    try {
        const { subscriptonCollection } = getCollections();
        const { sessionId } = req.query;

        if (!sessionId) {
            throw new ApiError(400, 'sessionId query param is required');
        }

        const existing = await subscriptonCollection.findOne({ sessionId });

        if (existing) {
            return res.send({
                success: true,
                data: {
                    heading: "You're all done here",
                    paragraph: "You've either completed your payment or this checkout session has timed out."
                }
            });
        }

        return res.send({
            success: true,
            message: "No existing session found, safe to push data to db"
        });
    } catch (err) {
        next(err);
    };
};