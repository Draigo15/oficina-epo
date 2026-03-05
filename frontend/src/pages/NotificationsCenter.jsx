import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Bell, BellOff, CheckCircle2, Search, CheckCheck, Clock, Info, AlertCircle } from 'lucide-react';

const NotificationsCenter = () => {
  const { error: toastError, success: toastSuccess } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [query, setQuery] = useState('');
  const [justRead, setJustRead] = useState(new Set());

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
      // Activar animación inmediatamente
      setJustRead((prev) => new Set([...prev, id]));
      await api.patch(`/notifications/${id}/read`);
      toastSuccess('Notificación marcada como leída');
      // Esperar animación antes de cambiar estado visual
      setTimeout(() => {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
        setJustRead((prev) => { const s = new Set(prev); s.delete(id); return s; });
      }, 600);
    } catch (err) {
      setJustRead((prev) => { const s = new Set(prev); s.delete(id); return s; });
      toastError('No se pudo actualizar la notificación');
    }
  };

  const filtered = notifications.filter((n) => {
    const byState = filter === 'all' ? true : filter === 'unread' ? !n.isRead : n.isRead;
    const byQuery = query.trim() === '' ? true : (n.message || '').toLowerCase().includes(query.toLowerCase());
    return byState && byQuery;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (message = '') => {
    const m = message.toLowerCase();
    if (m.includes('complet') || m.includes('finaliz')) return { Icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (m.includes('venc') || m.includes('plazo') || m.includes('tarde')) return { Icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' };
    if (m.includes('asign') || m.includes('nueva')) return { Icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' };
    return { Icon: Info, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' };
  };

  const tabs = [
    { key: 'all',    label: 'Todas',     count: notifications.length },
    { key: 'unread', label: 'No leídas', count: unreadCount },
    { key: 'read',   label: 'Leídas',    count: notifications.length - unreadCount },
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-0 space-y-6">

        {/* ── Encabezado ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="relative">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-xl">
                  <Bell className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              Notificaciones
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 ml-1">
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-lg shadow-green-600/30 transition-all duration-200"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas leídas
            </button>
          )}
        </div>

        {/* ── Tabs de filtro ── */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === key
                  ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                filter === key
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Buscador ── */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar notificación…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>

        {/* ── Lista ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-5 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-5">
                <BellOff className="w-9 h-9 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'Sin resultados'}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {filter === 'unread' ? '¡Estás al día con todo!' : 'Intenta con otro filtro o término de búsqueda'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((n) => {
                const { Icon, color, bg } = getNotifIcon(n.message);
                return (
                  <li
                    key={n._id}
                    className={`flex items-start gap-4 p-5 transition-colors ${
                      !n.isRead
                        ? 'bg-purple-50/60 dark:bg-purple-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                    }`}
                  >
                    {/* Ícono */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        {!n.isRead && (
                          <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-500" />
                        )}
                        <p className={`text-sm leading-snug ${
                          !n.isRead
                            ? 'font-semibold text-gray-900 dark:text-white'
                            : 'font-normal text-gray-600 dark:text-gray-300'
                        }`}>
                          {n.message}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 ml-4">
                        <Clock className="inline w-3 h-3 mr-1 -mt-0.5" />
                        {new Date(n.createdAt).toLocaleString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Botón */}
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        title="Marcar como leída"
                        disabled={justRead.has(n._id)}
                        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          justRead.has(n._id)
                            ? 'bg-green-100 dark:bg-green-900/40 scale-125 shadow-md shadow-green-400/40'
                            : 'bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/60 hover:scale-110'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 transition-all duration-300 ${
                            justRead.has(n._id)
                              ? 'text-green-500 scale-110'
                              : 'text-purple-600 dark:text-purple-400'
                          }`}
                        />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsCenter;
