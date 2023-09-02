const Photo = require("../models/Photo");
const User = require("../models/User");

// insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
    const { title } = req.body;
    const image = req.file.filename;

    const reqUser = req.user;
    const user = await User.findById(reqUser._id);

    // create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // check if photo was created
    if (!newPhoto) {
        return res.status(422).json({
            errors: ["Error ocurred, please try again later."],
        });
    }

    return res.status(201).json(newPhoto);
};

// delete a photo from DB
const deletePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        return res.status(404).json({ errors: ["Photo cannot found."] });
    }

    // check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
        return res.status(422).json({
            errors: ["Error ocurred, please try again later."],
        });
    }

    await Photo.findByIdAndDelete(photo._id);

    return res.status(200).json({ id: photo._id, message: "Photo deleted." });
};

const getAllPhotos = async (req, res) => {
    const photos = await Photo.find({})
        .sort([["createdAt", -1]])
        .exec();

    return res.status(200).json(photos);
};

const getUserPhotos = async (req, res) => {
    const { id } = req.params;
    const photos = await Photo.find({ userId: id })
        .sort([["createdAt", -1]])
        .exec();

    return res.status(200).json(photos);
};

const getPhotoById = async (req, res) => {
    const { id } = req.params;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        return res.status(404).json({ errors: ["Photo cannot found"] });
    }

    return res.status(200).json(photo);
};

const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        return res.status(404).json({ errors: ["Photo cannot found."] });
    }

    // check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
        return res.status(422).json({
            errors: ["Error ocurred, please try again later."],
        });
    }

    if (title) {
        photo.title = title;
    }

    await photo.save();

    return res.status(200).json({ photo, message: "Photo updated." });
};

const likePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        return res.status(404).json({ errors: ["Photo cannot found."] });
    }

    // check if user already liked the photo
    if (photo.likes.includes(reqUser._id)) {
        return res
            .status(422)
            .json({ errors: ["You already liked that photo."] });
    }

    // put user id in likes array
    photo.likes.push(reqUser._id);

    await photo.save();

    return res.status(200).json({
        photoId: id,
        userId: reqUser._id,
        message: "The photo was liked",
    });
};

const commentPhoto = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);
    const photo = await Photo.findById(id);

    // check if photo exists
    if (!photo) {
        return res.status(404).json({ errors: ["Photo cannot found."] });
    }

    // put comment in comments array
    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    };

    photo.comments.push(userComment);

    await photo.save();

    return res.status(200).json({
        comment: userComment,
        message: "The photo was commented",
    });
};

// search photos by title
const searchPhotos = async (req, res) => {
    const { q } = req.query;

    const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

    return res.status(200).json(photos);
};

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
};
