const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(cookieParser()); 
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const {authRouter} = require('./routes/auth');
const {profileRouter} = require('./routes/profile');
const {requestRouter} = require('./routes/request');
const {userRoute} = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRoute);

connectDB()
  .then(() => {
    console.log('DB connected Successfully!');
    app.listen(PORT, () => {
      console.log('Server is started listening on port', PORT);
    });
  })
  .catch((err) => {
    console.log('DB connection failed, Reason =>', err);
  });
