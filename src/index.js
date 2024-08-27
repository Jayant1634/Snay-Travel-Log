const express = require('express');
const morgan= require('morgan');
const helmet= require('helmet');
const cors= require('cors');
const mongoose = require('mongoose');
const middlewares = require('./middlewares');
const logs = require('./api/logs');


require('dotenv').config();

const app = express();

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json());


app.get('/', (req,res)=>{
    res.json({
        message:'hello world',
    });
});

app.use('/api/logs', logs);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port= process.env.Port || 1337;
app.listen(port,()=>{
    console.log(`listening at http://localhost:${port}`);
});