const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Saves database records cleanly inside a local folder file
  logging: false
});

// Admin User Profile Model Schema Mapping
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// Registration Endpoint Gateway
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Username or email already exists.' });
  }
});

// Login Verification Endpoint Gateway
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
    
    // Generate the token signed with a secret key
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1d' });
    
    // ✅ CRITICAL: Send BOTH token and user profile details back to the browser
    res.json({ 
      token, 
      user: { username: user.username, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mock Route Handlers to prevent dashboard crashes
app.use('/api/assets', express.Router().get('/', (req, res) => res.json([])));
app.use('/api/bookings', express.Router().get('/', (req, res) => res.json([])));
app.use('/api/maintenance', express.Router().get('/', (req, res) => res.json([])));
app.get('/api/dashboard/summary', (req, res) => res.json({ totalAssets: 0, activeBookings: 0, pendingMaintenance: 0 }));

app.get('/', (req, res) => res.send('🚀 AssetFlow Server Running via Local Storage.'));

// Sync Database and Initialize Port Listening
sequelize.sync().then(() => {
  console.log('✅ SQLite database initialized and synced locally inside database.sqlite!');
  app.listen(PORT, () => console.log(`📡 Server actively monitoring port ${PORT}`));
}).catch(err => console.error('❌ Database Initialization Crash:', err));