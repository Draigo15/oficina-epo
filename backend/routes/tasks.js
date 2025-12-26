import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
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
      .populate('completedBy', 'fullName');

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
    const { title, description, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'fullName');

    // Notificar a los asistentes si la tarea fue creada por una Jefa
    if (req.user.role === 'jefa') {
      const asistentes = await User.find({ role: 'asistente' });
      
      const notifications = asistentes.map(asistente => ({
        recipient: asistente._id,
        sender: req.user._id,
        type: 'new_task',
        message: `Nueva tarea asignada: ${title}`,
        task: task._id
      }));
      
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    }

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
    const { title, description, priority } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName');

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
      .populate('completedBy', 'fullName');

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
      .populate('createdBy', 'fullName');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al reabrir tarea', error: error.message });
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

// @route   PATCH /api/tasks/:id/reschedule
// @desc    Reprogramar fecha de tarea
// @access  Private
router.patch('/:id/reschedule', protect, async (req, res) => {
  try {
    const { scheduledDate } = req.body;
    
    if (!scheduledDate) {
      return res.status(400).json({ message: 'Se requiere una fecha' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    task.scheduledDate = scheduledDate;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al reprogramar tarea', error: error.message });
  }
});

export default router;
