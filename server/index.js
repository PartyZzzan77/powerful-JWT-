const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

const start = async () => {
    try {
        app.listen(PORT, () =>
            console.log(`Server started at http://localhost:${PORT}`)
        );
    } catch (error) {
        console.log(error.message);
    }
};
start();
