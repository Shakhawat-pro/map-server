import { User } from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        console.log("verifyAdmin");
        const email = req.decoded.email;
        const user = await User.findOne({ email });

        if (!user || user.role !== 'admin') {
            return res.status(403).send({ message: 'Forbidden Access' });
        }

        next();
    } catch (error) {
        return res.status(500).send({ message: 'Server Error', error: error.message });
    }
};
