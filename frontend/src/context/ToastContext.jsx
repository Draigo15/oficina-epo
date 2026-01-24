import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = (message) => addToast(message, 'success');
  const error = (message) => addToast(message, 'error');
  const warning = (message) => addToast(message, 'warning');
  const info = (message) => addToast(message, 'info');

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 slide-in-right
              ${toast.type === 'success' ? 'bg-white border-l-4 border-green-500 text-green-700' : ''}
              ${toast.type === 'error' ? 'bg-white border-l-4 border-red-500 text-red-700' : ''}
              ${toast.type === 'warning' ? 'bg-white border-l-4 border-yellow-500 text-yellow-700' : ''}
              ${toast.type === 'info' ? 'bg-white border-l-4 border-purple-500 text-purple-700' : ''}
            `}
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-purple-500" />}
            </div>
            <div className="ml-3 text-sm font-medium flex-1">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 rounded-lg p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
