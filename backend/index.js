const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
const { startBlockchainListener } = require('./src/services/blockchain.service');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

connectDB();
startBlockchainListener();

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); 
app.use('/api/tickets', ticketRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('VeriTix API đang chạy ngon lành! 🚀');
});

app.use(notFound);
app.use(errorHandler);


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
  });
}

module.exports = app;