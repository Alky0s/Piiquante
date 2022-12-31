// We import express package, body-parser and mongoose 
const express = require('express');
// const helmet = require("helmet");
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
// We imports routers 
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');
// Connection between our API and the database
mongoose.connect('mongodb+srv://Alky0s:DevWebPowA@cluster0.smvfjby.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// We create our express app
const app = express();
// We use helmet
// app.use(helmet());
// We extracts request body 
app.use(express.json());
app.use(bodyParser.json());
// Middleware for CORS issue
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// Middlewares for routes logic
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
// We exports our app 
module.exports = app;