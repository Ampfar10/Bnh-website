const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Handle POST request for user registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save the user
  const newUser = new User({
    username,
    password: hashedPassword
  });

  await newUser.save();
  res.status(201).send('User registered successfully');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
