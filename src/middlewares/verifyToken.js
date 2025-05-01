// middlewares/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    console.log("verifyToken");
    
    
    const authHeader = req.headers.authorization;
    // console.log(authHeader);


    if (!authHeader) {
        // console.log('authHeader');
        return res.status(401).send({ message: "Unauthorized Access" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized Access" });
        }
        req.decoded = decoded;
        next();
    });
};
