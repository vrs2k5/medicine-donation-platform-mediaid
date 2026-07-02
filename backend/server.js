require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

connectDB(process.env.MONGO_URI);

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reports', require('./routes/reports'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
