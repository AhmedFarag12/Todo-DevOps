require('dotenv').config();

const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'DevOps Todo API is running',
  });
});

app.use('/api/todos', todoRoutes);
app.use('/todos', todoRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.name === 'ValidationError' ? 400 : 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server error',
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
