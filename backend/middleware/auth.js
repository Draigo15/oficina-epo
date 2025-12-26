import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

export const isJefa = (req, res, next) => {
  if (req.user && req.user.role === 'jefa') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Solo la Jefa puede realizar esta acción' });
  }
};
