import express from 'express';
import Task from '../models/Task.js';
import { protect, isJefa } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Obtener todas las tareas
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const tasks = await Task.find(filter)
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName')
      .populate('comments.author', 'fullName')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Obtener una tarea por ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName')
      .populate('comments.author', 'fullName');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tarea', error: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Crear nueva tarea
// @access  Private (Todos pueden crear)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'fullName')
      .populate('comments.author', 'fullName');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea', error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Actualizar tarea
// @access  Private (Solo Jefa)
router.put('/:id', protect, isJefa, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? (dueDate || null) : task.dueDate;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName')
      .populate('comments.author', 'fullName');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea', error: error.message });
  }
});

// @route   PATCH /api/tasks/:id/complete
// @desc    Marcar tarea como completada
// @access  Private
router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    task.status = 'completada';
    task.completedBy = req.user._id;
    task.completedAt = new Date();

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName')
      .populate('comments.author', 'fullName');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al completar tarea', error: error.message });
  }
});

// @route   PATCH /api/tasks/:id/reopen
// @desc    Volver a marcar tarea como pendiente
// @access  Private
router.patch('/:id/reopen', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    task.status = 'pendiente';
    task.completedBy = undefined;
    task.completedAt = undefined;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('createdBy', 'fullName')
      .populate('comments.author', 'fullName');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al reabrir tarea', error: error.message });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Añadir un comentario a una tarea
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }
    if (text.trim().length > 500) {
      return res.status(400).json({ message: 'El comentario no puede superar los 500 caracteres' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    task.comments.push({ text: text.trim(), author: req.user._id });
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName')
      .populate('comments.author', 'fullName');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir comentario', error: error.message });
  }
});

// @route   DELETE /api/tasks/:id/comments/:commentId
// @desc    Eliminar un comentario (autor o jefa)
// @access  Private
router.delete('/:id/comments/:commentId', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const comment = task.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Solo el autor del comentario o la jefa puede eliminarlo
    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isJefa = req.user.role === 'jefa';

    if (!isAuthor && !isJefa) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    comment.deleteOne();
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName')
      .populate('comments.author', 'fullName');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar comentario', error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Eliminar tarea
// @access  Private (Solo Jefa)
router.delete('/:id', protect, isJefa, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await task.deleteOne();
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea', error: error.message });
  }
});

export default router;
