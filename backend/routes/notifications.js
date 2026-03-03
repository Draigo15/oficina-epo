import express from 'express';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Obtener notificaciones del usuario
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'fullName')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(20); // Limitar a las últimas 20 notificaciones

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones', error: error.message });
  }
});

// @route   PATCH /api/notifications/:id/read
// @desc    Marcar notificación como leída
// @access  Private
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    // Verificar que la notificación pertenezca al usuario
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar notificación', error: error.message });
  }
});

// @route   GET /api/notifications/check-due
// @desc    Generar notificaciones automáticas para tareas vencidas / por vencer
// @access  Private
router.get('/check-due', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Tareas pendientes que ya vencieron o vencen hoy/mañana
    const dueTasks = await Task.find({
      status: 'pendiente',
      dueDate: { $lte: endOfTomorrow }
    }).select('_id title dueDate createdBy');

    let created = 0;
    for (const task of dueTasks) {
      // Evitar duplicados: no crear si ya existe una notif de hoy para esta tarea
      const exists = await Notification.findOne({
        recipient: req.user._id,
        task: task._id,
        type: 'task_due',
        createdAt: { $gte: oneDayAgo }
      });
      if (exists) continue;

      const dueDate = new Date(task.dueDate);
      const diffDays = Math.round((dueDate - startOfToday) / (1000 * 60 * 60 * 24));

      let message;
      if (diffDays < 0) {
        const d = Math.abs(diffDays);
        message = `⚠️ Tarea vencida hace ${d} ${d === 1 ? 'día' : 'días'}: "${task.title}"`;
      } else if (diffDays === 0) {
        message = `🚨 ¡Vence HOY!: "${task.title}"`;
      } else {
        message = `⏰ Vence mañana: "${task.title}"`;
      }

      await Notification.create({
        recipient: req.user._id,
        sender: req.user._id,
        type: 'task_due',
        message,
        task: task._id
      });
      created++;
    }

    res.json({ checked: dueTasks.length, created });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar vencimientos', error: error.message });
  }
});

// @route   PATCH /api/notifications/read-all
// @desc    Marcar todas las notificaciones como leídas
// @access  Private
router.patch('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar notificaciones', error: error.message });
  }
});

export default router;
