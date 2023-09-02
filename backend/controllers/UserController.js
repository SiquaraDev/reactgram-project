const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// generate user token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

const generatePasswordHash = async (password) => {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
};

// register user and sign in
const register = async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    // check if user exists
    if (user) {
        return res.status(422).json({ errors: ["Email already in use."] });
    }

    const passwordHash = await generatePasswordHash(password);

    // create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash,
    });

    if (!newUser) {
        return res.status(422).json({
            errors: ["Error ocurred, please try again later."],
        });
    }

    return res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // check if user exists
    if (!user) {
        return res.status(404).json({ errors: ["User cannot found."] });
    }

    // check if password matches
    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(422).json({ errors: ["Invalid email or password"] });
    }

    return res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    });
};

const getCurrentUser = async (req, res) => {
    const user = req.user;

    return res.status(200).json(user);
};

// update an user
const update = async (req, res) => {
    const { name, password, bio } = req.body;

    let profileImage = null;

    if (req.file) {
        profileImage = req.file.filename;
    }

    const reqUser = req.user;
    const user = await User.findById(reqUser._id).select("-password");

    if (name) {
        user.name = name;
    }

    if (password) {
        const passwordHash = await generatePasswordHash(password);

        user.password = passwordHash;
    }

    if (profileImage) {
        user.profileImage = profileImage;
    }

    if (bio) {
        user.bio = bio;
    }

    await user.save();

    res.status(200).json(user);
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password");

        // check if user exists
        if (!user) {
            return res.status(404).json({ errors: ["User cannot found."] });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({ errors: ["User cannot found."] });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById,
};
