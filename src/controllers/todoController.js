const mongoose = require('mongoose');
const Todo = require('../models/Todo');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

const getTodos = async (_req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid todo id' });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    return res.status(200).json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid todo id' });
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    return res.status(200).json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid todo id' });
    }

    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    return res.status(200).json({ success: true, data: todo });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
