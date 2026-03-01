import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, PieChart as PieIcon, Activity, CheckCircle2, Clock, AlertTriangle, ListChecks, RefreshCw } from 'lucide-react';

const COLORS = ['#7c3aed', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-purple-600">{payload[0].value} completadas</p>
      </div>
    );
  }
  return null;
};

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

  const completionRate = stats && stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const rateColor = completionRate >= 70
    ? 'text-green-600 dark:text-green-400'
    : completionRate >= 40
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-red-500 dark:text-red-400';

  const rateBarColor = completionRate >= 70 ? 'bg-green-500' : completionRate >= 40 ? 'bg-amber-400' : 'bg-red-500';

  const rateLabel = completionRate >= 70 ? 'Excelente rendimiento' : completionRate >= 40 ? 'Rendimiento moderado' : 'Requiere atención';

  const kpis = [
    {
      label: 'Total de tareas',
      value: stats?.total || 0,
      icon: ListChecks,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
      iconColor: 'text-purple-600 dark:text-purple-400',
      valueColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      label: 'Pendientes',
      value: stats?.pending || 0,
      icon: Clock,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
      iconColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      label: 'Completadas',
      value: stats?.completed || 0,
      icon: CheckCircle2,
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/50',
      iconColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-700 dark:text-green-300',
    },
    {
      label: 'Alta prioridad',
      value: stats?.highPriority || 0,
      icon: AlertTriangle,
      bg: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-900/50',
      iconColor: 'text-red-600 dark:text-red-400',
      valueColor: 'text-red-700 dark:text-red-300',
    },
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-8">

        {/* ── Encabezado ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-xl">
                <Activity className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              Estadísticas
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 ml-1">Resumen general del comité</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 border border-gray-100 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ── KPI cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map(({ label, value, icon: Icon, bg, iconBg, iconColor, valueColor }) => (
                <div key={label} className={`${bg} rounded-2xl p-5 border border-transparent shadow-sm flex flex-col gap-3`}>
                  <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className={`text-3xl font-extrabold mt-0.5 ${valueColor}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Tasa de cumplimiento ── */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Tasa de cumplimiento
                </h3>
                <span className={`text-2xl font-extrabold ${rateColor}`}>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`${rateBarColor} h-3 rounded-full transition-all duration-700`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className={`text-sm mt-2 font-medium ${rateColor}`}>{rateLabel}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stats?.completed} de {stats?.total} tareas completadas</p>
            </div>

            {/* ── Gráficas lado a lado ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Productividad */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Productividad mensual</h3>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productivity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', radius: 8 }} />
                      <Bar dataKey="completed" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Distribución por estado */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <PieIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Distribución por estado</h3>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={3}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Stats;
