import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

const COLORS = ['#7c3aed', '#22c55e'];

const Stats = () => {
  const { error: toastError } = useToast();
  const [stats, setStats] = useState(null);
  const [productivity, setProductivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        api.get('/reports/stats'),
        api.get('/reports/productivity')
      ]);
      // Normalizar claves del backend a las usadas por la vista
      const s = sRes.data || {};
      setStats({
        total: s.totalTasks ?? s.total ?? 0,
        pending: s.pendingTasks ?? s.pending ?? 0,
        completed: s.completedTasks ?? s.completed ?? 0,
        highPriority: s.highPriorityTasks ?? s.highPriority ?? 0,
      });
      const prod = Array.isArray(pRes.data) ? pRes.data.map((d) => ({
        ...d,
        completed: d.completed ?? d.completadas ?? 0,
      })) : [];
      setProductivity(prod);
    } catch (err) {
      console.error('Error cargando estadísticas', err);
      toastError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const pieData = stats ? [
    { name: 'Completadas', value: stats.completed || 0 },
    { name: 'Pendientes', value: stats.pending || 0 }
  ] : [];

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-8 h-8 mr-3 text-purple-600 dark:text-purple-400" />
            Estadísticas
          </h2>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 text-center">Cargando…</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Alta prioridad</p>
                <p className="text-2xl font-bold text-red-600">{stats?.highPriority || 0}</p>
              </div>
            </div>

            {/* Productividad últimos 6 meses */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Productividad (últimos 6 meses)</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minHeight={256} minWidth={256}>
                  <BarChart data={productivity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#7c3aed" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribución por estado */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <PieIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Distribución por estado</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minHeight={256} minWidth={256}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" label outerRadius={90}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Stats;
