const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const propertyRoute = require('./routes/propertyRoute');
const cookieParser = require('cookie-parser');
require('dotenv').config()

app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/property', propertyRoute);

mongoose.connect('mongodb+srv://root:root123@cluster0.spzqt.mongodb.net/invitationhomesApi?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log("Can't connect", err);
});

app.listen(process.env.PORT || 7000, () => {
    console.log('Listening to port');
})