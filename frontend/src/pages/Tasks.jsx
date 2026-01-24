import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { Plus, Check, X, AlertCircle, Clock, Trash2, RotateCcw, Search, Edit2 } from 'lucide-react';

const Tasks = () => {
  const { isJefa } = useAuth();
  const { success, error } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pendiente, completada
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal'
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
      setFormData({ title: '', description: '', priority: 'normal' });
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
      setFormData({ title: '', description: '', priority: 'normal' });
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
      priority: task.priority
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

  const filteredTasks = tasks.filter(task => {
    // Filtrar por estado
    if (filter !== 'all' && task.status !== filter) return false;
    
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
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Barra de búsqueda */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
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
                setFormData({ title: '', description: '', priority: 'normal' });
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

        {/* Filtros simplificados y grandes */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`p-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              filter === 'all'
                ? 'text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
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
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
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
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
            style={filter === 'completada' ? {backgroundColor: '#a055cc'} : {}}
          >
            <div className="text-3xl mb-2">✅</div>
            Hechas
            <div className="text-sm mt-1 opacity-80">({tasks.filter(t => t.status === 'completada').length})</div>
          </button>
        </div>

        {/* Lista de tareas */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-2xl font-semibold text-gray-700 mb-2">No hay tareas aquí</p>
              <p className="text-gray-500">
                {filter === 'pendiente' ? '¡Perfecto! No tienes tareas pendientes' : 
                 filter === 'completada' ? 'Aún no has completado ninguna tarea' :
                 'Comienza creando tu primera tarea'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task._id} className={`card hover:shadow-xl transition-all duration-200 ${
                task.status === 'completada' ? 'bg-green-50 border-2 border-green-200' : 
                task.priority === 'alta' ? 'bg-red-50 border-2 border-red-200' : 
                'bg-white border-2 border-gray-200'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      {task.status === 'completada' ? (
                        <span className="text-3xl">✅</span>
                      ) : task.priority === 'alta' ? (
                        <span className="text-3xl">🔴</span>
                      ) : (
                        <span className="text-3xl">📌</span>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900">{task.title}</h3>
                    </div>
                    {task.description && (
                      <p className="text-gray-700 text-lg mb-3 ml-12">{task.description}</p>
                    )}
                    <div className="ml-12 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-semibold mr-2">Prioridad:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          task.priority === 'alta' ? 'bg-pink-100 text-pink-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {task.priority === 'alta' ? '🔴 Urgente' : '🟣 Normal'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Creada por: {task.createdBy?.fullName} - {formatDate(task.createdAt)}
                      </p>
                      {task.completedAt && (
                        <p className="text-sm text-green-700 font-semibold">
                          ✅ Completada: {formatDate(task.completedAt)} por {task.completedBy?.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-3 ml-0 md:ml-6">
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

        {/* Modal para crear tarea */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
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
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Editar Tarea
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                    setFormErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
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
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900">Confirmar Eliminación</h3>
                  <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                ¿Estás seguro de que deseas eliminar la tarea <span className="font-bold">"{taskToDelete.title}"</span>?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteTask}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  Sí, Eliminar
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
