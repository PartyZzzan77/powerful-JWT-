require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;
const mongoURL = process.env.MONGO_URL;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const start = async () => {
    try {
        mongoose.set({ strictQuery: false });
        mongoose.connect(mongoURL);

        app.listen(PORT, () =>
            console.log(`Server started at http://localhost:${PORT}`)
        );
    } catch (error) {
        console.log(error.message);
    }
};
start();
