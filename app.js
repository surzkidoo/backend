const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const moment = require('moment');
app.use(cors());
app.use(express.json());


const mongoose = require('mongoose');
const Transaction = require('./model/Transaction');
const User = require('./model/User');


const mongoURI = 'mongodb+srv://karaads101:Mayorgnn088@cluster0.tlitwbg.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



app.get('/transactions', async (req, res) => {
  try {
    const { page = 1, transactionType } = req.query;

    console.log(transactionType)

    const query = (transactionType=='all' | !transactionType) ? {} : {transactionType};

    const options = {
      page: parseInt(page, 10),
      limit: 50,
    };

    const result = await Transaction.paginate(query, options);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user', async (req, res) => {
  try {
    const { page = 1 } = req.query;


    const options = {
      page: parseInt(page, 10),
      limit: 50,
    };

    const result = await User.paginate({}, options);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
