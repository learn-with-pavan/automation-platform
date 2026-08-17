const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");
const Organization = require("../models/Organization");
const { generateToken } = require("../utils/jwt");

const registerUser = async ({
    name,
    email,
    password,
    organizationName,
}) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Check if user already exists
        const existingUser = await User.findOne({ email }).session(session);

        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Create organization slug
        const slug = organizationName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        // Check if organization already exists
        const existingOrganization = await Organization.findOne({
            slug,
        }).session(session);

        if (existingOrganization) {
            throw new Error("Organization name is already taken");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create organization
        const [organization] = await Organization.create(
            [
                {
                    name: organizationName,
                    slug,
                },
            ],
            { session }
        );

        // Create owner user
        const [user] = await User.create(
            [
                {
                    name,
                    email,
                    password: hashedPassword,
                    role: "owner",
                    organizationId: organization._id,
                },
            ],
            { session }
        );

        // Set organization owner
        organization.ownerId = user._id;

        await organization.save({ session });

        // Everything succeeded
        await session.commitTransaction();

        const token = generateToken(user);

        return {
            user,
            organization,
            token
        };
    } catch (error) {
        // Something failed → rollback everything
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password')
    }

    if (!user.isActive) {
        throw new Error('User account is inactive')
    }

    const validate = await bcrypt.compare(password, user.password)
    if (!validate) {
        throw new Error('Invalid email or password')
    }

    const token = generateToken(user)

    return {
        user,
        token
    }
}
module.exports = {
    registerUser,
    loginUser
};