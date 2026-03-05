import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { Plus, Check, X, AlertCircle, Clock, Trash2, RotateCcw, Search, Edit2, List, Calendar as CalendarIcon, LayoutGrid, MessageCircle, Send } from 'lucide-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

const Tasks = () => {
  const { isJefa, user } = useAuth();
  const { success, error } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pendiente, completada
  const [timePeriod, setTimePeriod] = useState('month'); // 'all', 'week', 'month'
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all', 'alta', 'normal'
  const [searchTerm, setSearchTerm] = useState('');
  // Reloj para re-renderizar el badge de vencimiento cada minuto
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'kanban'
  const [calendarSubView, setCalendarSubView] = useState('grid'); // 'grid' | 'weekly'
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    dueDate: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
      error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 200) {
      errors.title = 'El título no puede tener más de 200 caracteres';
    }
    
    if (formData.description && formData.description.length > 1000) {
      errors.description = 'La descripción no puede tener más de 1000 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Por favor corrige los errores en el formulario');
      return;
    }
    
    try {
      await api.post('/tasks', formData);
      setFormData({ title: '', description: '', priority: 'normal', dueDate: '' });
      setFormErrors({});
      setShowModal(false);
      fetchTasks();
      success('Tarea creada exitosamente');
    } catch (err) {
      console.error('Error al crear tarea:', err);
      error('Error al crear la tarea');
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Por favor corrige los errores en el formulario');
      return;
    }
    
    try {
      await api.put(`/tasks/${editingTask._id}`, formData);
      setFormData({ title: '', description: '', priority: 'normal', dueDate: '' });
      setFormErrors({});
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
      success('Tarea actualizada exitosamente');
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      error('Error al actualizar la tarea');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
      success('Tarea marcada como completada');
    } catch (err) {
      console.error('Error al completar tarea:', err);
      error('Error al completar la tarea');
    }
  };

  const handleReopenTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/reopen`);
      fetchTasks();
      success('Tarea reabierta correctamente');
    } catch (err) {
      console.error('Error al reabrir tarea:', err);
      error('Error al reabrir la tarea');
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      setShowDeleteModal(false);
      setTaskToDelete(null);
      fetchTasks();
      success('Tarea eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      error('Error al eliminar la tarea');
    }
  };

  const openCommentsModal = (task) => {
    setSelectedTask(task);
    setNewComment('');
    setShowCommentsModal(true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    setSubmittingComment(true);
    try {
      const response = await api.post(`/tasks/${selectedTask._id}/comments`, { text: newComment.trim() });
      setSelectedTask(response.data);
      setTasks(prev => prev.map(t => t._id === response.data._id ? response.data : t));
      setNewComment('');
      success('Comentario agregado');
    } catch (err) {
      console.error('Error al agregar comentario:', err);
      error('Error al agregar el comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedTask) return;
    try {
      const response = await api.delete(`/tasks/${selectedTask._id}/comments/${commentId}`);
      setSelectedTask(response.data);
      setTasks(prev => prev.map(t => t._id === response.data._id ? response.data : t));
      success('Comentario eliminado');
    } catch (err) {
      console.error('Error al eliminar comentario:', err);
      error('Error al eliminar el comentario');
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Filtrar por estado
    if (filter !== 'all' && task.status !== filter) return false;
    
    // Filtrar por período de tiempo
    if (timePeriod !== 'all') {
      const now = moment();
      const taskDate = task.dueDate ? moment(task.dueDate) : moment(task.createdAt);
      
      if (timePeriod === 'week') {
        // Esta semana (lunes a domingo)
        const weekStart = now.clone().startOf('week');
        const weekEnd = now.clone().endOf('week');
        if (!taskDate.isBetween(weekStart, weekEnd, null, '[]')) return false;
      } else if (timePeriod === 'month') {
        // Este mes
        const monthStart = now.clone().startOf('month');
        const monthEnd = now.clone().endOf('month');
        if (!taskDate.isBetween(monthStart, monthEnd, null, '[]')) return false;
      }
    }
    
    // Filtrar por prioridad
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(term);
      const descMatch = task.description?.toLowerCase().includes(term);
      return titleMatch || descMatch;
    }
    
    return true;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Verificar si una tarea está vencida
  const isOverdue = (task) => {
    if (!task.dueDate || task.status === 'completada') return false;
    return new Date(task.dueDate) < new Date();
  };

  // Verificar si una tarea vence pronto (en los próximos 3 días)
  const isDueSoon = (task) => {
    if (!task.dueDate || task.status === 'completada') return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= threeDaysFromNow;
  };

  // Retorna estado detallado de vencimiento para mostrar badge
  const getDueStatus = (task) => {
    if (!task.dueDate) return null;

    const now = new Date();
    const due = new Date(task.dueDate);
    // Comparar solo fechas (sin hora) para diffDays
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueStart   = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays   = Math.round((dueStart - todayStart) / (1000 * 60 * 60 * 24));

    if (task.status === 'completada') {
      const completedAt = task.completedAt ? new Date(task.completedAt) : now;
      const wasLate = due < completedAt;
      return {
        label: wasLate ? 'Completada fuera de plazo' : 'Completada a tiempo',
        badge: wasLate ? '⚠️' : '✅',
        color: wasLate ? 'gray' : 'green',
        type: 'completed',
      };
    }

    if (diffDays < 0) {
      const daysLate = Math.abs(diffDays);
      return {
        label: daysLate === 1 ? 'Venció ayer' : `Vencida hace ${daysLate} días`,
        badge: '🔴',
        color: 'red',
        type: 'overdue',
      };
    }
    if (diffDays === 0) return { label: '¡Vence HOY!',     badge: '🚨', color: 'orange', type: 'today'    };
    if (diffDays === 1) return { label: 'Vence mañana',    badge: '⏰', color: 'amber',  type: 'tomorrow' };
    if (diffDays <= 3)  return { label: `Vence en ${diffDays} días`, badge: '⚡', color: 'yellow', type: 'soon' };
    if (diffDays <= 7)  return { label: `Vence en ${diffDays} días`, badge: '📅', color: 'blue',   type: 'week' };
    return               { label: `Vence en ${diffDays} días`,       badge: '📅', color: 'teal',   type: 'future' };
  };

  // Badge visual de vencimiento
  const DueBadge = ({ task, size = 'sm' }) => {
    const st = getDueStatus(task);
    if (!st) return null;
    const colorCls = {
      red:    'bg-red-100    dark:bg-red-900/40    text-red-700    dark:text-red-400    border border-red-300    dark:border-red-700',
      orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-700 animate-pulse',
      amber:  'bg-amber-100  dark:bg-amber-900/40  text-amber-700  dark:text-amber-400  border border-amber-300  dark:border-amber-700',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700',
      blue:   'bg-blue-100   dark:bg-blue-900/40   text-blue-700   dark:text-blue-400   border border-blue-300   dark:border-blue-700',
      teal:   'bg-teal-100   dark:bg-teal-900/40   text-teal-700   dark:text-teal-400   border border-teal-300   dark:border-teal-700',
      green:  'bg-green-100  dark:bg-green-900/40  text-green-700  dark:text-green-400  border border-green-300  dark:border-green-700',
      gray:   'bg-gray-100   dark:bg-gray-700/40   text-gray-600   dark:text-gray-400   border border-gray-300   dark:border-gray-600',
    }[st.color] || '';
    const sizeCls = { xs: 'text-xs px-1.5 py-0.5', sm: 'text-xs px-2.5 py-1', md: 'text-sm px-3 py-1.5' }[size];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-bold whitespace-nowrap ${colorCls} ${sizeCls}`}>
        {st.badge} {st.label}
      </span>
    );
  };

  // Convertir tareas a eventos del calendario
  const calendarEvents = tasks.map(task => {
    // Usar dueDate si existe, sino createdAt
    const eventDate = task.dueDate ? new Date(task.dueDate) : new Date(task.createdAt);
    
    return {
      id: task._id,
      title: task.title,
      start: eventDate,
      end: eventDate,
      resource: task,
      allDay: true
    };
  });

  // Estilos personalizados para los eventos del calendario
  const eventStyleGetter = (event) => {
    const task = event.resource;
    let backgroundColor = '#663399'; // morado por defecto
    
    if (task.status === 'completada') {
      backgroundColor = '#10b981'; // verde
    } else if (isOverdue(task)) {
      backgroundColor = '#dc2626'; // rojo oscuro para vencidas
    } else if (task.priority === 'alta') {
      backgroundColor = '#ef4444'; // rojo
    } else if (isDueSoon(task)) {
      backgroundColor = '#f59e0b'; // naranja para que vence pronto
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0',
        display: 'block',
        fontWeight: '600',
        fontSize: '0.875rem'
      }
    };
  };

  // Manejar clic en evento del calendario
  const handleSelectEvent = (event) => {
    const task = event.resource;
    if (isJefa() && task.status === 'pendiente') {
      openEditModal(task);
    }
  };

  // Manejar drag & drop en Kanban
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // Si no hay destino, no hacer nada
    if (!destination) return;

    // Si es el mismo lugar, no hacer nada
    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) return;

    // Mapear droppableId a status
    const statusMap = {
      'pendiente': 'pendiente',
      'completada': 'completada'
    };

    const newStatus = statusMap[destination.droppableId];
    
    try {
      // Si se mueve a completada, marcar como completa
      if (newStatus === 'completada') {
        await api.patch(`/tasks/${draggableId}/complete`);
        success('Tarea marcada como completada');
      } else if (newStatus === 'pendiente') {
        // Si se mueve a pendiente desde completada, reabrir
        await api.patch(`/tasks/${draggableId}/reopen`);
        success('Tarea reabierta');
      }
      
      fetchTasks();
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      error('Error al mover la tarea');
    }
  };

  // Agrupar tareas para Kanban (respetando filtros de estado, búsqueda y período)
  const tasksByStatus = {
    pendiente: filteredTasks.filter(t => t.status === 'pendiente'),
    completada: filteredTasks.filter(t => t.status === 'completada')
  };

  // Componente para tarjeta de tarea en Kanban
  const KanbanTaskCard = ({ task, index }) => (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-gray-700 rounded-lg p-4 mb-3 shadow-md border-l-4 cursor-grab active:cursor-grabbing transition-all ${
            snapshot.isDragging ? 'shadow-lg scale-105' : ''
          } ${task.priority === 'alta' ? 'border-red-500' : 'border-purple-500'}`}
        >
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
            <span className={`px-2 py-1 rounded-full font-semibold ${
              task.priority === 'alta'
                ? 'bg-red-100 dark:bg-red-700/70 text-red-700 dark:text-red-100'
                : 'bg-purple-100 dark:bg-purple-700/60 text-purple-700 dark:text-purple-100'
            }`}>
              {task.priority === 'alta' ? '🔴 Urgente' : '🟣 Normal'}
            </span>
            {task.dueDate && <DueBadge task={task} size="xs" />}
          </div>
        </div>
      )}
    </Draggable>
  );

  // Columna Kanban
  const KanbanColumn = ({ title, status, tasks, icon }) => (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 min-h-96 transition-colors ${
            snapshot.isDraggingOver ? 'bg-purple-100 dark:bg-purple-900/30' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{icon}</span>
            <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
            <span className="ml-auto bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <KanbanTaskCard key={task._id} task={task} index={index} />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderBottomColor: '#663399'}}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Tareas</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                setFormData({ title: '', description: '', priority: 'normal', dueDate: '' });
                setFormErrors({});
                setShowModal(true);
              }}
              className="btn-primary flex items-center justify-center whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
            </button>
          </div>
        </div>

        {/* Pestañas de vista */}
        <div className="mb-6 flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <List className="w-5 h-5" />
            Lista
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <CalendarIcon className="w-5 h-5" />
            Calendario
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            Kanban
          </button>
        </div>

        {viewMode === 'list' ? (
          <>
            {/* Filtros simplificados y grandes */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              filter === 'all'
                ? 'text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
            }`}
            style={filter === 'all' ? {backgroundColor: '#663399'} : {}}
          >
            <div className="text-3xl mb-2">📋</div>
            Todas las Tareas
            <div className="text-sm mt-1 opacity-80">({tasks.length})</div>
          </button>
          <button
            onClick={() => setFilter('pendiente')}
            className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              filter === 'pendiente'
                ? 'text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
            }`}
            style={filter === 'pendiente' ? {backgroundColor: '#8844aa'} : {}}
          >
            <div className="text-3xl mb-2">⏳</div>
            Por Hacer
            <div className="text-sm mt-1 opacity-80">({tasks.filter(t => t.status === 'pendiente').length})</div>
          </button>
          <button
            onClick={() => setFilter('completada')}
            className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              filter === 'completada'
                ? 'text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
            }`}
            style={filter === 'completada' ? {backgroundColor: '#a055cc'} : {}}
          >
            <div className="text-3xl mb-2">✅</div>
            Hechas
            <div className="text-sm mt-1 opacity-80">({tasks.filter(t => t.status === 'completada').length})</div>
          </button>
        </div>

        {/* Filtro de Prioridad - Solo en vista Lista */}
        {viewMode === 'list' && (
          <div className="mb-4 flex gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-fit">
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                priorityFilter === 'all'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              🗂️ Todas
            </button>
            <button
              onClick={() => setPriorityFilter('alta')}
              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                priorityFilter === 'alta'
                  ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              🔴 Urgente
            </button>
            <button
              onClick={() => setPriorityFilter('normal')}
              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                priorityFilter === 'normal'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              🟣 Normal
            </button>
          </div>
        )}

        {/* Filtros de Período de Tiempo - Solo en vista Lista */}
        {viewMode === 'list' && (
          <div className="mb-6 flex gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-fit">
            <button
              onClick={() => setTimePeriod('all')}
              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                timePeriod === 'all'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              📅 Todas
            </button>
            <button
              onClick={() => setTimePeriod('week')}
              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                timePeriod === 'week'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              📆 Esta Semana
            </button>
            <button
              onClick={() => setTimePeriod('month')}
              className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                timePeriod === 'month'
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              📆 Este Mes
            </button>
          </div>
        )}

            {/* Lista de tareas */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="card text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No hay tareas aquí</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'pendiente' ? '¡Perfecto! No tienes tareas pendientes' : 
                     filter === 'completada' ? 'Aún no has completado ninguna tarea' :
                     'Comienza creando tu primera tarea'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task._id} className={`card hover:shadow-xl transition-all duration-200 ${
                task.status === 'completada' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' : 
                isOverdue(task) ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800' :
                task.priority === 'alta' ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' : 
                isDueSoon(task) ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800' :
                'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      {task.status === 'completada' ? (
                        <span className="text-3xl">✅</span>
                      ) : isOverdue(task) ? (
                        <span className="text-3xl">⚠️</span>
                      ) : task.priority === 'alta' ? (
                        <span className="text-3xl">🔴</span>
                      ) : isDueSoon(task) ? (
                        <span className="text-3xl">⏰</span>
                      ) : (
                        <span className="text-3xl">📌</span>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
                      <DueBadge task={task} size="sm" />
                    </div>
                    {task.description && (
                      <p className="text-gray-700 dark:text-gray-300 text-lg mb-3 ml-12">{task.description}</p>
                    )}
                    <div className="ml-12 space-y-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold mr-2">Prioridad:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.priority === 'alta'
                            ? 'bg-red-100 dark:bg-red-700/70 text-red-800 dark:text-red-100'
                            : 'bg-purple-100 dark:bg-purple-700/60 text-purple-800 dark:text-purple-100'
                        }`}>
                          {task.priority === 'alta' ? '🔴 Urgente' : '🟣 Normal'}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="font-semibold text-gray-600 dark:text-gray-400">Fecha límite:</span>
                          <span className="text-gray-700 dark:text-gray-300">{formatDateOnly(task.dueDate)}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Creada por: {task.createdBy?.fullName} - {formatDate(task.createdAt)}
                      </p>
                      {task.completedAt && (
                        <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                          ✅ Completada: {formatDate(task.completedAt)} por {task.completedBy?.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-3 ml-0 md:ml-6">
                    {/* Botón de comentarios - visible siempre */}
                    <button
                      onClick={() => openCommentsModal(task)}
                      className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:text-purple-700 dark:hover:text-purple-400 transition-colors font-semibold text-sm shadow-sm flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600"
                      title="Ver comentarios"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {task.comments?.length > 0 ? `${task.comments.length} comentario${task.comments.length !== 1 ? 's' : ''}` : 'Comentarios'}
                    </button>
                    {task.status === 'pendiente' ? (
                      <>
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="px-6 py-3 text-white rounded-lg transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                          style={{backgroundColor: '#8844aa'}}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#7733aa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#8844aa'}
                          title="Marcar como completada"
                        >
                          <Check className="w-6 h-6 mr-2" />
                          Marcar como Hecha
                        </button>
                        {isJefa() && (
                          <button
                            onClick={() => openEditModal(task)}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                            title="Editar tarea"
                          >
                            <Edit2 className="w-6 h-6 mr-2" />
                            Editar
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleReopenTask(task._id)}
                        className="px-6 py-3 text-white rounded-lg transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                        style={{backgroundColor: '#a055cc'}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#9944bb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#a055cc'}
                        title="Volver a pendiente"
                      >
                        <RotateCcw className="w-6 h-6 mr-2" />
                        Deshacer
                      </button>
                    )}
                    {isJefa() && (
                      <button
                        onClick={() => confirmDeleteTask(task)}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg shadow-md flex items-center justify-center"
                        title="Eliminar tarea"
                      >
                        <Trash2 className="w-6 h-6 mr-2" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
            </div>
          </>
        ) : viewMode === 'calendar' ? (
          /* Vista de Calendario / Lista Semanal */
          <div className="space-y-4">
            {/* Toggle de sub-vista */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
              <button
                onClick={() => setCalendarSubView('grid')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                  calendarSubView === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                Calendario mensual
              </button>
              <button
                onClick={() => setCalendarSubView('weekly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                  calendarSubView === 'weekly'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <List className="w-4 h-4" />
                Lista semanal
              </button>
            </div>

            {calendarSubView === 'grid' ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" style={{ height: '700px' }}>
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: '100%' }}
                  eventPropGetter={eventStyleGetter}
                  onSelectEvent={handleSelectEvent}
                  messages={{
                    next: 'Siguiente',
                    previous: 'Anterior',
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    agenda: 'Agenda',
                    date: 'Fecha',
                    time: 'Hora',
                    event: 'Tarea',
                    noEventsInRange: 'No hay tareas en este rango',
                    showMore: (total) => `+ Ver más (${total})`
                  }}
                  views={['month', 'week', 'day', 'agenda']}
                  defaultView="month"
                />
              </div>
            ) : (
              /* Lista semanal personalizada */
              (() => {
                const today = new Date();
                // Calcular el lunes de la semana actual
                const dayOfWeek = today.getDay(); // 0=dom
                const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(today);
                monday.setDate(today.getDate() + diffToMon);
                monday.setHours(0, 0, 0, 0);

                const weekDays = Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(monday);
                  d.setDate(monday.getDate() + i);
                  return d;
                });

                const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

                const sameDay = (a, b) =>
                  a.getFullYear() === b.getFullYear() &&
                  a.getMonth() === b.getMonth() &&
                  a.getDate() === b.getDate();

                const tasksWithDate = tasks.filter(t => t.dueDate);
                const tasksWithoutDate = tasks.filter(t => !t.dueDate);

                return (
                  <div className="space-y-4">
                    {weekDays.map((day, idx) => {
                      const dayTasks = tasksWithDate.filter(t => sameDay(new Date(t.dueDate), day));
                      const isToday = sameDay(day, today);
                      const isPast = day < today && !isToday;
                      return (
                        <div key={idx} className={`rounded-xl border-2 overflow-hidden ${
                          isToday
                            ? 'border-purple-500 dark:border-purple-400'
                            : isPast
                            ? 'border-gray-200 dark:border-gray-700 opacity-70'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}>
                          {/* Cabecera del día */}
                          <div className={`px-5 py-3 flex items-center justify-between ${
                            isToday
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}>
                            <span className="font-bold text-sm">
                              {dayNames[day.getDay()]} {day.getDate()} de {day.toLocaleDateString('es-MX', { month: 'long' })}
                              {isToday && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">HOY</span>}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              isToday ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                              {dayTasks.length} {dayTasks.length === 1 ? 'tarea' : 'tareas'}
                            </span>
                          </div>

                          {/* Tareas del día */}
                          <div className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                            {dayTasks.length === 0 ? (
                              <p className="py-3 px-5 text-sm text-gray-400 dark:text-gray-600 italic">Sin tareas para este día</p>
                            ) : dayTasks.map(task => (
                              <div key={task._id} className="px-5 py-3 flex items-center gap-3">
                                <span className="text-lg">
                                  {task.status === 'completada' ? '✅' : isOverdue(task) ? '🔴' : task.priority === 'alta' ? '🔴' : '📌'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-semibold text-sm truncate ${task.status === 'completada' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                    {task.title}
                                  </p>
                                  {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{task.description}</p>}
                                </div>
                                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  task.priority === 'alta'
                                    ? 'bg-red-100 dark:bg-red-700/70 text-red-800 dark:text-red-100'
                                    : 'bg-purple-100 dark:bg-purple-700/60 text-purple-800 dark:text-purple-100'
                                }`}>
                                  {task.priority === 'alta' ? 'Urgente' : 'Normal'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {/* Tareas sin fecha */}
                    {tasksWithoutDate.length > 0 && (
                      <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-600 dark:text-gray-400">Sin fecha asignada</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {tasksWithoutDate.length}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                          {tasksWithoutDate.slice(0, 5).map(task => (
                            <div key={task._id} className="px-5 py-3 flex items-center gap-3">
                              <span className="text-lg">{task.status === 'completada' ? '✅' : '📋'}</span>
                              <p className={`flex-1 text-sm font-semibold truncate ${task.status === 'completada' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                {task.title}
                              </p>
                            </div>
                          ))}
                          {tasksWithoutDate.length > 5 && (
                            <p className="px-5 py-2 text-xs text-gray-400 dark:text-gray-500">
                              +{tasksWithoutDate.length - 5} más...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        ) : (
          /* Vista de Kanban */
          <>
            {/* Filtros de Período de Tiempo - También en Kanban */}
            <div className="mb-6 flex gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg w-fit">
              <button
                onClick={() => setTimePeriod('all')}
                className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                  timePeriod === 'all'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                📅 Todas
              </button>
              <button
                onClick={() => setTimePeriod('week')}
                className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                  timePeriod === 'week'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                📆 Esta Semana
              </button>
              <button
                onClick={() => setTimePeriod('month')}
                className={`px-4 py-2 rounded-md font-semibold transition-all text-sm ${
                  timePeriod === 'month'
                    ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                📆 Este Mes
              </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KanbanColumn 
                title="Por Hacer"
                status="pendiente"
                tasks={tasksByStatus.pendiente}
                icon="📋"
              />
              <KanbanColumn 
                title="Completadas"
                status="completada"
                tasks={tasksByStatus.completada}
                icon="✅"
              />
              </div>
            </DragDropContext>
          </>
        )}

        {/* Modal para crear tarea */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                    }}
                    className={`input-field ${formErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Título de la tarea (mín. 3 caracteres)"
                    maxLength="200"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.title.length}/200 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                    }}
                    className={`input-field ${formErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Detalles de la tarea (opcional)"
                    rows="3"
                    maxLength="1000"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.description.length}/1000 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="normal">🟣 Normal</option>
                    <option value="alta">🔴 Alta - Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha límite (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.dueDate ? `📅 ${formatDateOnly(formData.dueDate)}` : 'Sin fecha límite'}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {isJefa() ? 'Crear Tarea' : 'Registrar Tarea'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormErrors({});
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal para editar tarea */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Editar Tarea
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleEditTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (formErrors.title) setFormErrors({ ...formErrors, title: null });
                    }}
                    className={`input-field ${formErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Título de la tarea (mín. 3 caracteres)"
                    maxLength="200"
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.title.length}/200 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                    }}
                    className={`input-field ${formErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Detalles de la tarea (opcional)"
                    rows="3"
                    maxLength="1000"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{formData.description.length}/1000 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="normal">🟣 Normal</option>
                    <option value="alta">🔴 Alta - Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha límite (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.dueDate ? `📅 ${formatDateOnly(formData.dueDate)}` : 'Sin fecha límite'}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Actualizar Tarea
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTask(null);
                      setFormErrors({});
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar */}
        {showDeleteModal && taskToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirmar Eliminación</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar la tarea <span className="font-bold">"{taskToDelete.title}"</span>?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteTask}
                  className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors font-semibold"
                >
                  Sí, Eliminar
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de comentarios */}
        {showCommentsModal && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
              {/* Cabecera */}
              <div className="flex justify-between items-start p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Comentarios</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-2">{selectedTask.title}</p>
                </div>
                <button
                  onClick={() => { setShowCommentsModal(false); setSelectedTask(null); setNewComment(''); }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Lista de comentarios */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
                {(!selectedTask.comments || selectedTask.comments.length === 0) ? (
                  <div className="text-center py-10">
                    <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Sin comentarios todavía</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Sé el primero en dejar una nota.</p>
                  </div>
                ) : (
                  selectedTask.comments.map((comment) => (
                    <div key={comment._id} className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{backgroundColor: '#663399'}}>
                              {comment.author?.fullName?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author?.fullName}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto whitespace-nowrap">
                              {new Date(comment.createdAt).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-9">{comment.text}</p>
                        </div>
                        {(isJefa() || comment.author?._id === user?._id) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                            title="Eliminar comentario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input para nuevo comentario */}
              <div className="p-5 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    placeholder="Escribe un comentario... (Enter para enviar)"
                    className="flex-1 resize-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                    rows={2}
                    maxLength={500}
                    disabled={submittingComment}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="self-end px-4 py-3 text-white rounded-xl transition-all font-semibold shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    style={{backgroundColor: '#663399'}}
                  >
                    {submittingComment ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 text-right">{newComment.length}/500</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
