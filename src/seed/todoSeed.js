require('dotenv').config();

const mongoose = require('mongoose');
const Todo = require('../models/Todo');

const todos = [
  {
    title: 'Review pull request for auth middleware',
    description: 'Check validation, error handling, and token expiry behavior before merging.',
    completed: false,
  },
  {
    title: 'Pay electricity bill',
    description: 'Use the banking app and save the receipt in the monthly expenses folder.',
    completed: false,
  },
  {
    title: 'Book dentist appointment',
    description: 'Call the clinic and choose an evening slot for next week.',
    completed: true,
  },
  {
    title: 'Prepare weekly deployment notes',
    description: 'Summarize shipped fixes, database changes, and rollback steps for the team.',
    completed: false,
  },
  {
    title: 'Buy groceries after work',
    description: 'Get coffee, eggs, bread, vegetables, and laundry detergent.',
    completed: false,
  },
  {
    title: 'Back up laptop projects',
    description: 'Push local repositories and copy personal files to the external drive.',
    completed: true,
  },
  {
    title: 'Update API README examples',
    description: 'Add sample requests for creating, updating, and deleting todos.',
    completed: false,
  },
  {
    title: 'Renew car license documents',
    description: 'Check required papers and prepare copies before visiting the traffic office.',
    completed: false,
  },
  {
    title: 'Plan Friday family lunch',
    description: 'Confirm the guest count and order dessert from the bakery.',
    completed: false,
  },
  {
    title: 'Check MongoDB Atlas metrics',
    description: 'Review connection count, slow queries, and storage usage for the todo cluster.',
    completed: true,
  },
];

const seedTodos = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existingCount = await Todo.countDocuments();

  if (existingCount > 0) {
    console.log(`Seed skipped: collection already has ${existingCount} todos`);
    return;
  }

  const insertedTodos = await Todo.insertMany(todos);
  console.log(`Seeded ${insertedTodos.length} realistic todos`);
};

seedTodos()
  .then(async () => {
    await mongoose.disconnect();
  })
  .catch(async (error) => {
    console.error(error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
