import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CheckCircle2, Clock, FileText, Plus, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isJefa } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/reports/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mb-4" style={{borderBottomColor: '#663399'}}></div>
          <p className="text-gray-600 text-lg">Cargando información...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        {/* Saludo personalizado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Hola, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            {isJefa() ? 'Aquí está el resumen de todas las tareas' : 'Aquí está el resumen de tu trabajo'}
          </p>
        </div>

        {/* Tarjetas de estadísticas grandes y claras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/tasks?filter=pendiente" className="card hover:shadow-xl transition-all duration-200 border-2" style={{background: 'linear-gradient(to bottom right, #f3e8ff, #e9d5ff)', borderColor: '#663399'}}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#663399'}}>
                <Clock className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-bold mb-2" style={{color: '#663399'}}>{stats?.pendingTasks || 0}</p>
              <p className="text-lg font-semibold" style={{color: '#552288'}}>Tareas Pendientes</p>
              <p className="text-sm mt-2" style={{color: '#663399'}}>Click para ver detalles</p>
            </div>
          </Link>

          <Link to="/tasks?filter=completada" className="card hover:shadow-xl transition-all duration-200 border-2" style={{background: 'linear-gradient(to bottom right, #faf5ff, #f3e8ff)', borderColor: '#8844aa'}}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#8844aa'}}>
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-bold mb-2" style={{color: '#8844aa'}}>{stats?.completedTasks || 0}</p>
              <p className="text-lg font-semibold" style={{color: '#663399'}}>Tareas Completadas</p>
              <p className="text-sm mt-2" style={{color: '#8844aa'}}>Click para ver detalles</p>
            </div>
          </Link>

          <Link to="/tasks" className="card hover:shadow-xl transition-all duration-200 border-2" style={{background: 'linear-gradient(to bottom right, #e9d5ff, #ddd6fe)', borderColor: '#7d3eb8'}}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: '#7d3eb8'}}>
                <FileText className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-bold mb-2" style={{color: '#7d3eb8'}}>{stats?.totalTasks || 0}</p>
              <p className="text-lg font-semibold" style={{color: '#552288'}}>Total de Tareas</p>
              <p className="text-sm mt-2" style={{color: '#7d3eb8'}}>Click para ver todas</p>
            </div>
          </Link>
        </div>

        {/* Alerta de tareas urgentes */}
        {stats?.highPriorityTasks > 0 && (
          <div className="card border-2 mb-8" style={{background: 'linear-gradient(to right, #fce7f3, #fae8ff)', borderColor: '#ec4899'}}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-10 w-10" style={{color: '#ec4899'}} />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold" style={{color: '#be185d'}}>
                  ¡Atención! Tienes {stats.highPriorityTasks} {stats.highPriorityTasks === 1 ? 'tarea urgente' : 'tareas urgentes'}
                </h3>
                <p className="mt-1" style={{color: '#ec4899'}}>Es importante atenderlas pronto</p>
              </div>
              <Link to="/tasks" className="ml-auto">
                <button className="btn-danger">Ver Tareas Urgentes</button>
              </Link>
            </div>
          </div>
        )}

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/tasks" className="card hover:shadow-xl transition-all duration-200 text-white" style={{background: 'linear-gradient(to bottom right, #663399, #7d3eb8)'}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {isJefa() ? 'Gestionar Tareas' : 'Ver Mis Tareas'}
                </h3>
                <p className="text-purple-100">
                  {isJefa() ? 'Crear, editar y organizar tareas' : 'Ver y completar tus tareas asignadas'}
                </p>
              </div>
              <Plus className="w-12 h-12" />
            </div>
          </Link>

          <Link to="/reports" className="card hover:shadow-xl transition-all duration-200 text-white" style={{background: 'linear-gradient(to bottom right, #8844aa, #a055cc)'}}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Generar Reporte</h3>
                <p className="text-purple-100">
                  Descarga el informe mensual en PDF
                </p>
              </div>
              <FileText className="w-12 h-12" />
            </div>
          </Link>
        </div>

        {/* Guía rápida */}
        <div className="mt-8 card" style={{background: 'linear-gradient(to right, #faf5ff, #f3e8ff)'}}>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-white rounded-full w-8 h-8 flex items-center justify-center mr-3" style={{backgroundColor: '#663399'}}>?</span>
            ¿Cómo usar el sistema?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg" style={{backgroundColor: '#663399'}}>1</div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Crea o registra tareas</p>
                <p className="text-gray-600 text-sm">Ve a "Tareas" y haz click en el botón {isJefa() ? '"Nueva Tarea"' : '"Registrar Tarea"'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg" style={{backgroundColor: '#663399'}}>2</div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Marca como completadas</p>
                <p className="text-gray-600 text-sm">Cuando termines una tarea, haz click en el botón verde ✓</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg" style={{backgroundColor: '#663399'}}>3</div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">Genera tu reporte</p>
                <p className="text-gray-600 text-sm">Ve a "Reportes", selecciona el mes y descarga el PDF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
