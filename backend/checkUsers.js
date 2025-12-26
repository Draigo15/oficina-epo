import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const users = await User.find({});
    
    console.log('\n👥 Usuarios en la base de datos:\n');
    console.log('='.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario: ${user.username}`);
      console.log(`   Nombre completo: ${user.fullName}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Creado: ${user.createdAt.toLocaleString('es-MX')}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`\nTotal de usuarios: ${users.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
