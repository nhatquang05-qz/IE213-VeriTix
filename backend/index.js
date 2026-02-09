const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
require('dotenv').config();
const { startBlockchainListener } = require('./src/services/blockchain.service');
const eventRoutes = require('./src/routes/eventRoutes');

const app = express();

connectDB();
startBlockchainListener();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('VeriTix Backend is Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});