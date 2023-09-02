const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// connection
const connection = async () => {
    try {
        const dbConnection = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.6eczunx.mongodb.net/?retryWrites=true&w=majority`
        );

        console.log("DB CONNECTED");

        return dbConnection;
    } catch (error) {
        console.log(error);
    }
};

connection();

module.exports = connection;
