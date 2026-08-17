const authorize = (...allowedRules) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            })
        }

        if (!allowedRules.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            })
        }

        next();
    }
}

module.exports = {
    authorize
}