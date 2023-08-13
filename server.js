const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Added JSON body parsing

// Connect to MongoDB
mongoose.connect('mongodb+srv://bnh:bnh@bnh.ipqtoy6.mongodb.net/?retryWrites=true&w=majority', {
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

// Handle POST request for user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });

  if (!user) {
    res.status(401).send('User not found');
    return;
  }

  // Compare password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Login failed');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
