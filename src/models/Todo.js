const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [120, 'Title must be at most 120 characters long'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters long'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Todo', todoSchema);
