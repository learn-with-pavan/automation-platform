const jwt = require('jsonwebtoken');
const { model } = require('mongoose');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                status: false,
                message: "Authentication token is required"
            })
        }

        const token = authHeader.split("")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.user = {
            userId: decoded.userId,
            organizationId: decoded.organizationId,
            role: decoded.role,
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token",
        });

    }
}

module.exports = { authenticate }