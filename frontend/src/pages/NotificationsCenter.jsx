import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Bell, CheckCircle2, Filter, Search } from 'lucide-react';

const NotificationsCenter = () => {
  const { error: toastError, success: toastSuccess } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [query, setQuery] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error al cargar notificaciones', err);
      toastError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toastSuccess('Todas marcadas como leídas');
    } catch (err) {
      toastError('No se pudo marcar todas');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      toastError('No se pudo actualizar la notificación');
    }
  };

  const filtered = notifications.filter((n) => {
    const byState = filter === 'all' ? true : filter === 'unread' ? !n.isRead : n.isRead;
    const byQuery = query.trim() === '' ? true : (n.message || '').toLowerCase().includes(query.toLowerCase());
    return byState && byQuery;
  });

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bell className="w-8 h-8 mr-3 text-purple-600 dark:text-purple-400" />
            Centro de Notificaciones
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                <option value="all">Todas</option>
                <option value="unread">No leídas</option>
                <option value="read">Leídas</option>
              </select>
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 mr-2 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por mensaje…"
                className="bg-transparent flex-1 text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
              />
            </div>

            <button
              onClick={markAllAsRead}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 flex items-center"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar todas leídas
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">Cargando…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">Sin resultados</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((n) => (
                <li key={n._id} className={`p-4 ${n.isRead ? 'opacity-75' : 'bg-purple-50/50 dark:bg-purple-900/10'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{n.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg"
                      >
                        Marcar leída
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsCenter;
