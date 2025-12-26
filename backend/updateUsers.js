import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Eliminar usuarios existentes
    await User.deleteMany({});
    console.log('🗑️  Usuarios anteriores eliminados');

    // Crear Jefa
    const jefa = await User.create({
      username: 'jefa',
      password: '123456',
      fullName: 'Angela Aquize Diaz',
      role: 'jefa'
    });
    console.log('✅ Jefa creada:', jefa.fullName);

    // Crear Asistente
    const asistente = await User.create({
      username: 'asistente',
      password: '123456',
      fullName: 'Rodrigo Lira Alvarez',
      role: 'asistente'
    });
    console.log('✅ Asistente creado:', asistente.fullName);

    console.log('\n✨ Usuarios actualizados correctamente:');
    console.log('   👩‍💼 Jefa: Angela Aquize Diaz (usuario: jefa)');
    console.log('   👨‍💻 Asistente: Rodrigo Lira Alvarez (usuario: asistente)');
    console.log('   🔑 Contraseña para ambos: 123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateUsers();
