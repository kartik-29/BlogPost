require('dotenv').config();
const mongose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = mongose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        console.log("MongoDB connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;