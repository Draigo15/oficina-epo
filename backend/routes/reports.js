import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/monthly
// @desc    Obtener tareas completadas de un mes específico
// @access  Private
router.get('/monthly', protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ 
        message: 'Se requieren los parámetros month (1-12) y year' 
      });
    }

    // Crear rango de fechas
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Buscar tareas completadas en ese rango
    const tasks = await Task.find({
      status: 'completada',
      completedAt: {
        $gte: startDate,
        $lte: endDate
      }
    })
      .populate('createdBy', 'fullName')
      .populate('completedBy', 'fullName')
      .sort({ completedAt: 1 });

    res.json({
      month: parseInt(month),
      year: parseInt(year),
      totalTasks: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al generar reporte', 
      error: error.message 
    });
  }
});

// @route   GET /api/reports/stats
// @desc    Obtener estadísticas generales
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: 'pendiente' });
    const completedTasks = await Task.countDocuments({ status: 'completada' });
    const highPriorityTasks = await Task.countDocuments({ 
      status: 'pendiente', 
      priority: 'alta' 
    });

    const upcomingTasks = await Task.find({ status: 'pendiente' })
      .sort({ scheduledDate: 1, createdAt: 1 })
      .limit(5)
      .populate('createdBy', 'fullName');

    res.json({
      totalTasks,
      pendingTasks,
      completedTasks,
      highPriorityTasks,
      upcomingTasks
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estadísticas', 
      error: error.message 
    });
  }
});

export default router;
