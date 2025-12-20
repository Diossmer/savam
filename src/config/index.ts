import mongoose from "mongoose";

// Cargar variables de entorno desde .env
process.loadEnvFile();

const connectDB = async () => {
  const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/savam';

  if (!process.env.MONGO_URL) {
    console.log('⚠️  MONGO_URL no está definida en .env, usando URL por defecto');
    console.log(`📝 URL: ${MONGO_URL}`);
  }

  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Base de datos: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    console.error('💡 Asegúrate de que MongoDB esté corriendo y que MONGO_URL esté configurada en .env');
    console.error('💡 Ejemplo: MONGO_URL=mongodb://127.0.0.1:27017/savam_db');
    process.exit(1);
  }
  // Manejar eventos de la conexión
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB desconectado');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Error en la conexión de MongoDB:', err);
  });
}

export default connectDB;