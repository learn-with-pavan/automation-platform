const { registerUser, loginUser } = require('../services/authService')

const register = async (req, res) => {
    try {
        const { name, email, password, organizationName } = req.body;

        const result = await registerUser({
            name,
            email,
            password,
            organizationName
        });

        return res.status(201).json({
            success: true,
            message: 'Registration sucessfull',
            data: {
                token: result.token,
                user: {
                    id: result?.user._id,
                    name: result?.user.name,
                    email: result.user.email,
                    role: result?.user.role,
                    organizationId: result?.user.organizationId
                },
                organization: {
                    id: result?.organization._id,
                    name: result?.organization.name,
                    slug: result?.organization.slug
                }
            }
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: 'Login successfull',
            data: {
                token: result.token,

                user: {
                    id: result.user._id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    organizationId: result.user.organizationId,
                },
            },
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
}
module.exports = { register, login }