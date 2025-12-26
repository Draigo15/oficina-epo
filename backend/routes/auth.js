import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario (Solo para setup inicial)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, fullName } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear usuario
    const user = await User.create({
      username,
      password,
      role,
      fullName
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuario
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener usuario actual
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    username: req.user.username,
    role: req.user.role,
    fullName: req.user.fullName
  });
});

export default router;
