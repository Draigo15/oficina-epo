import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  priority: {
    type: String,
    enum: ['normal', 'alta'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['pendiente', 'completada'],
    default: 'pendiente'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ completedAt: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
