const Task = require('../models/Task');

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const { name, description, dueDate } = req.body;

  try {
    // Create a new task
    const task = new Task({
      name,
      description,
      dueDate,
      user: req.user.id,
    });

    // Save the task to the database
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const { name, description, dueDate, completed } = req.body;

  // Build task object
  const taskFields = {};
  if (name) taskFields.name = name;
  if (description) taskFields.description = description;
  if (dueDate) taskFields.dueDate = dueDate;
  if (completed) taskFields.completed = completed;

  try {
    // Find the task by ID
    let task = await Task.findById(req.params.id);

    // Check if the task exists
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Check if the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update the task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    // Find the task by ID
    let task = await Task.findById(req.params.id);

    // Check if the task exists
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Check if the user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Delete the task
    await Task.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
