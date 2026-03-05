import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './models/Notification.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Conectado a MongoDB');

  // Buscar usuarios
  const jefa     = await User.findOne({ role: 'jefa' });
  const asistente = await User.findOne({ role: 'asistente' });

  if (!jefa) {
    console.error('❌ No se encontró usuario con rol jefa');
    process.exit(1);
  }

  const senderId   = asistente?._id ?? jefa._id;
  const recipientId = jefa._id;

  // Borrar notificaciones previas del usuario jefa (para empezar limpio)
  await Notification.deleteMany({ recipient: recipientId });

  const notifs = [
    {
      recipient: recipientId,
      sender: senderId,
      type: 'new_task',
      message: 'Se te asignó una nueva tarea: "Elaborar acta de reunión mensual"',
      isRead: false,
    },
    {
      recipient: recipientId,
      sender: senderId,
      type: 'task_completed',
      message: 'La tarea "Registro de asistencias Febrero" fue marcada como completada',
      isRead: false,
    },
    {
      recipient: recipientId,
      sender: senderId,
      type: 'task_updated',
      message: 'Se actualizó la tarea "Informe mensual CMC" — prioridad cambiada a Alta',
      isRead: true,
    },
    {
      recipient: recipientId,
      sender: senderId,
      type: 'task_due',
      message: 'La tarea "Envío de reporte a dirección" vence hoy',
      isRead: false,
    },
    {
      recipient: recipientId,
      sender: senderId,
      type: 'new_task',
      message: 'Nueva tarea creada: "Coordinación de capacitación docente"',
      isRead: true,
    },
    {
      recipient: recipientId,
      sender: senderId,
      type: 'task_due',
      message: 'La tarea "Revisión de expedientes pendientes" vence mañana',
      isRead: false,
    },
    {
      recipient: recipientId,
      sender: senderId,
      type: 'new_task',
      message: 'Se te asignó una nueva tarea: "Preparación de agenda para reunión directiva"',
      isRead: false,
    },
    {
      recipient: recipientId,
      sender: senderId,
      type: 'task_updated',
      message: 'La tarea "Control de inventario de materiales" fue actualizada con comentarios nuevos',
      isRead: false,
    },
  ];

  await Notification.insertMany(notifs);
  console.log(`✅ ${notifs.length} notificaciones insertadas para: ${jefa.fullName}`);

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
