import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Plus, Check, X, AlertCircle, Clock, Trash2, RotateCcw } from 'lucide-react';

const Tasks = () => {
  const { isJefa } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pendiente, completada
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', formData);
      setFormData({ title: '', description: '', priority: 'normal' });
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      fetchTasks();
    } catch (error) {
      console.error('Error al completar tarea:', error);
      alert('Error al completar la tarea');
    }
  };

  const handleReopenTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/reopen`);
      fetchTasks();
    } catch (error) {
      console.error('Error al reabrir tarea:', error);
      alert('Error al reabrir la tarea');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      alert('Error al eliminar la tarea');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h2>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
          </button>
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
                        onClick={() => handleDeleteTask(task._id)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isJefa() ? 'Nueva Tarea' : 'Registrar Tarea'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Título de la tarea"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    placeholder="Detalles de la tarea (opcional)"
                    rows="3"
                  />
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
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {isJefa() ? 'Crear Tarea' : 'Registrar Tarea'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
