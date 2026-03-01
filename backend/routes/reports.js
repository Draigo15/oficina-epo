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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const overdueTasks = await Task.countDocuments({
      status: 'pendiente',
      dueDate: { $lt: startOfToday }
    });

    res.json({
      totalTasks,
      pendingTasks,
      completedTasks,
      highPriorityTasks,
      overdueTasks
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estadísticas', 
      error: error.message 
    });
  }
});
// @route   GET /api/reports/productivity
// @desc    Obtener tareas completadas por mes (últimos 6 meses)
// @access  Private
router.get('/productivity', protect, async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyData = [];
    
    // Generar datos para los últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
      
      const completedCount = await Task.countDocuments({
        status: 'completada',
        completedAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      monthlyData.push({
        month: monthNames[monthDate.getMonth()],
        completed: completedCount,
        year: monthDate.getFullYear()
      });
    }
    
    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener datos de productividad', 
      error: error.message 
    });
  }
});

// @route   GET /api/reports/urgent-tasks
// @desc    Obtener tareas urgentes (vencidas, hoy, mañana)
// @access  Private
router.get('/urgent-tasks', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const endOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
    
    // Tareas vencidas
    const overdueTasks = await Task.find({
      status: 'pendiente',
      dueDate: { $lt: startOfToday }
    })
      .populate('createdBy', 'fullName')
      .sort({ dueDate: 1 })
      .limit(5);
    
    // Tareas que vencen hoy
    const todayTasks = await Task.find({
      status: 'pendiente',
      dueDate: { $gte: startOfToday, $lte: endOfToday }
    })
      .populate('createdBy', 'fullName')
      .sort({ priority: -1 })
      .limit(5);
    
    // Tareas que vencen mañana
    const tomorrowTasks = await Task.find({
      status: 'pendiente',
      dueDate: { $gt: endOfToday, $lte: endOfTomorrow }
    })
      .populate('createdBy', 'fullName')
      .sort({ priority: -1 })
      .limit(5);
    
    res.json({
      overdue: overdueTasks,
      today: todayTasks,
      tomorrow: tomorrowTasks,
      totalUrgent: overdueTasks.length + todayTasks.length + tomorrowTasks.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener tareas urgentes', 
      error: error.message 
    });
  }
});

// @route   GET /api/reports/my-stats
// @desc    Estadísticas personales del usuario actual (asistente)
// @access  Private
router.get('/my-stats', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const myCompletedMonth = await Task.countDocuments({
      completedBy: req.user._id,
      completedAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const totalThisMonth = await Task.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const myPending = await Task.countDocuments({ status: 'pendiente' });

    const myOverdue = await Task.countDocuments({
      status: 'pendiente',
      dueDate: { $lt: startOfToday }
    });

    const myCompletedTotal = await Task.countDocuments({ completedBy: req.user._id });

    const monthName = now.toLocaleDateString('es-MX', { month: 'long' });
    const progressPercent = totalThisMonth > 0
      ? Math.round((myCompletedMonth / totalThisMonth) * 100)
      : 0;

    res.json({
      myCompletedMonth,
      myCompletedTotal,
      totalThisMonth,
      myPending,
      myOverdue,
      progressPercent,
      monthName
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas personales', error: error.message });
  }
});

export default router;
